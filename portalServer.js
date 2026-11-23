const http = require("http");
const url = require("url");
require("dotenv").config();

const { getPortalHtml } = require("./portalView");
const {
  isValidEmail,
  isValidPhone,
  checkRateLimit,
  createOtpSession,
  verifyOtp,
  finalizeRegistration,
  findRegistration,
  sanitize,
} = require("./security");

const {
  sendHackathonOtpEmail,
  sendHackathonRegistrationEmail,
  sendHackathonTeamInviteEmail,
} = require("./hackathonMailer");
const { generateHackathonPass } = require("./generateHackathonPass");

const PORT = process.env.PORTAL_PORT || 4000;

function setSecurityHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        // 1MB max body protection
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost:" + PORT}`);
  const pathname = reqUrl.pathname;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

  // ── Portal UI ──
  if (pathname === "/" || pathname === "/portal" || pathname === "/portal/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(getPortalHtml());
    return;
  }

  // ── API: Request OTP ──
  if (pathname === "/portal/api/request-otp" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const email = (data.email || "").trim().toLowerCase();

      if (!isValidEmail(email)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Please provide a valid email address." }));
        return;
      }

      if (!data.participantName || data.participantName.trim().length < 2) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Participant name is required (min 2 characters)." }));
        return;
      }

      // Rate limit check: max 3 OTP requests per 5 minutes per IP and email
      const rateCheckIp = checkRateLimit(`otp:ip:${clientIp}`, 5, 5 * 60 * 1000);
      if (!rateCheckIp.allowed) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: `Too many requests. Please retry in ${rateCheckIp.retryAfterSeconds}s.` }));
        return;
      }

      const rateCheckEmail = checkRateLimit(`otp:email:${email}`, 3, 5 * 60 * 1000);
      if (!rateCheckEmail.allowed) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: `Too many OTP requests for this email. Please wait ${rateCheckEmail.retryAfterSeconds}s.` }));
        return;
      }

      // Create cryptographically secure OTP session
      const { token, rawOtp, expiresAt } = createOtpSession(email, data);

      // Dispatch OTP Email
      const mailResult = await sendHackathonOtpEmail({
        to: email,
        participantName: data.participantName,
        code: rawOtp,
        expiresInMinutes: 10,
        service: "nodemailer",
      });

      if (!mailResult.success) {
        console.warn("[portalServer] Mail dispatch error:", mailResult.error);
      }

      console.log(`[Security] OTP generated for ${email}. Session Token: ${token.slice(0, 8)}... (Code: ${rawOtp})`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        token,
        expiresAt,
        demoOtp: rawOtp,
        message: `Verification code sent to ${email}`,
      }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ── API: Verify OTP & Finalize Registration ──
  if (pathname === "/portal/api/verify-and-register" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const token = data.token;
      const otp = data.otp;

      if (!token || !otp) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Missing session token or verification code." }));
        return;
      }

      // Verify OTP
      const verifyResult = verifyOtp(token, otp);
      if (!verifyResult.success) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: verifyResult.error }));
        return;
      }

      // Finalize and persist registration
      const finalResult = finalizeRegistration(token);
      if (!finalResult.success) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: finalResult.error }));
        return;
      }

      const reg = finalResult.registration;

      // Automatically dispatch Official Registration Confirmation Email with PDF Pass!
      sendHackathonRegistrationEmail({
        to: reg.email,
        participantName: reg.participantName,
        registrationId: reg.registrationId,
        teamName: reg.teamName || "Solo",
        track: reg.track,
        attachPass: true,
        service: "nodemailer",
      }).catch((e) => console.error("[portalServer] Error sending confirmation email:", e));

      // If team members provided, dispatch invitations
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach((memberEmail) => {
          if (isValidEmail(memberEmail)) {
            sendHackathonTeamInviteEmail({
              to: memberEmail,
              inviterName: reg.participantName,
              teamName: reg.teamName,
              track: reg.track,
              service: "nodemailer",
            }).catch((e) => console.error("[portalServer] Error inviting teammate:", e));
          }
        });
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        alreadyRegistered: finalResult.alreadyRegistered,
        registration: reg,
        message: "Registration successfully verified and pass issued!",
      }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ── API: Lookup Registration ──
  if (pathname === "/portal/api/lookup") {
    const q = reqUrl.searchParams.get("q") || "";
    const reg = findRegistration(q);

    if (reg) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, registration: reg }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Registration not found" }));
    }
    return;
  }

  // ── API: Download PDF Pass ──
  if (pathname === "/api/hackathon/download-pass") {
    try {
      const participantName = reqUrl.searchParams.get("participantName") || "Innovator";
      const registrationId  = reqUrl.searchParams.get("registrationId") || "IHUB-2026-9842";
      const teamName        = reqUrl.searchParams.get("teamName") || "Solo";
      const track           = reqUrl.searchParams.get("track") || "AI, Generative Agents & Automation";

      const pdfBuffer = await generateHackathonPass({
        participantName,
        registrationId,
        teamName,
        track,
      });

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${registrationId}-iHub-Pass.pdf"`,
        "Content-Length": pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("PDF Generation Error: " + err.message);
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

function listen(port) {
  server.listen(port, () => {
    console.log(`\n🔒 Secured i-Hub Hackathon Registration Portal running at: http://localhost:${port}`);
    console.log(`Users can register, verify email OTP, and claim their pass directly in the browser.\n`);
  });
}

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    const nextPort = Number(PORT) + 1;
    console.log(`Port ${PORT} in use, trying http://localhost:${nextPort}...`);
    listen(nextPort);
  } else {
    console.error("Portal server error:", err);
  }
});

listen(PORT);

module.exports = { server };
