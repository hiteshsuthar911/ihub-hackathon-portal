const http = require("http");
const fs   = require("fs");
const path = require("path");
require("dotenv").config();

const {
  HackathonApplicationInviteEmail,
  HackathonRegistrationEmail,
  HackathonTeamInviteEmail,
  HackathonAcceptanceEmail,
  HackathonSubmissionEmail,
  HackathonOtpEmail,
  HackathonDossierEmail,
  HackathonShortlistRsvpEmail,
  HackathonFinalPassEmail,
  renderEmail,
} = require("./emails");

const {
  sendHackathonApplicationInviteEmail,
  sendHackathonRegistrationEmail,
  sendHackathonTeamInviteEmail,
  sendHackathonAcceptanceEmail,
  sendHackathonSubmissionEmail,
  sendHackathonOtpEmail,
  sendHackathonDossierEmail,
  sendHackathonShortlistEmail,
  sendHackathonFinalPassEmail,
} = require("./hackathonMailer");

const db = require("./db");

const { generateHackathonPass } = require("./generateHackathonPass");
const { sendMailWithNodemailer, sendMailWithResend } = require("./sendMail");
const { getPortalHtml } = require("./portalView");
const {
  isValidEmail,
  checkRateLimit,
  createOtpSession,
  verifyOtp,
  finalizeRegistration,
  findRegistration,
} = require("./security");

const PORT = process.env.PORT || 3000;

// ── i-Hub Ahmedabad Hackathon Templates Registry ──
const TEMPLATES = {
  "apply-hackathon": {
    label: "Apply for Hackathon @ i-Hub",
    badge: "Call for Innovators",
    icon: "🚀",
    Component: HackathonApplicationInviteEmail,
    defaultProps: {
      recipientName: "Innovator",
      hackathonName: "i-Hub Gujarat Innovation Hackathon 2026",
      organizer: "i-Hub (Gujarat Student Startup & Innovation Hub)",
      venue: "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
      eventDates: "December 12 - 14, 2026",
      applicationDeadline: "November 30, 2026 at 11:59 PM IST",
      applyUrl: "http://localhost:3000/portal",
      guideUrl: "https://ihubgujarat.in/hackathon/guidelines",
      prizePool: "₹10,00,000+ & Incubation Grants",
    },
    subject: "🚀 Apply Now: i-Hub Gujarat Innovation Hackathon 2026 @ Navrangpura, Ahmedabad",
  },
  "registration": {
    label: "Registration & Pass",
    badge: "Confirmed",
    icon: "⚡",
    Component: HackathonRegistrationEmail,
    defaultProps: {
      participantName: "Alex Rivera",
      registrationId: "IHUB-2026-9842",
      teamName: "NeuralVoyage",
      track: "AI, Generative Agents & Automation",
      hackathonName: "i-Hub Gujarat Innovation Hackathon 2026",
      eventDate: "December 12 - 14, 2026",
      venue: "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
      checkInTime: "Friday, Dec 12 at 08:30 AM IST",
      discordUrl: "https://discord.gg/ihubhackathon",
      guideUrl: "https://ihubgujarat.in/hackathon/handbook",
      calendarUrl: "https://ihubgujarat.in/calendar.ics",
      prizePool: "₹10,00,000+",
    },
    subject: "⚡ Registration Confirmed: i-Hub Gujarat Innovation Hackathon 2026",
  },
  "team-invite": {
    label: "Team Squad Invitation",
    badge: "Squad",
    icon: "🤝",
    Component: HackathonTeamInviteEmail,
    defaultProps: {
      inviteeName: "Dev Hacker",
      inviterName: "Elena Rostova",
      teamName: "CyberSynthetics",
      track: "AI, Generative Agents & Automation",
      hackathonName: "i-Hub Gujarat Innovation Hackathon 2026",
      venue: "i-Hub Ahmedabad, Navrangpura, Ahmedabad",
      inviteUrl: "http://localhost:3000/portal",
      expiresInHours: 48,
      teamMembers: ["Elena Rostova (Lead)", "Kavita Rao", "Marcus Vance"],
    },
    subject: "🤝 Team Invitation: Join CyberSynthetics @ i-Hub Hackathon 2026",
  },
  "accepted": {
    label: "Application Accepted & RSVP",
    badge: "Selected",
    icon: "🎉",
    Component: HackathonAcceptanceEmail,
    defaultProps: {
      participantName: "Jordan Hayes",
      hackathonName: "i-Hub Gujarat Innovation Hackathon 2026",
      rsvpUrl: "http://localhost:3000/portal",
      rsvpDeadline: "December 5, 2026 at 11:59 PM IST",
      venue: "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
      eventDate: "December 12 - 14, 2026",
      discordUrl: "https://discord.gg/ihubhackathon",
    },
    subject: "🎉 You're Accepted to i-Hub Gujarat Innovation Hackathon 2026! Please RSVP",
  },
  "submission": {
    label: "Project Submission Receipt",
    badge: "Submitted",
    icon: "🚀",
    Component: HackathonSubmissionEmail,
    defaultProps: {
      participantName: "Dev Hacker",
      teamName: "NeuralVoyage",
      projectName: "AutoAgent Omni-Workflow",
      tagline: "Autonomous multi-agent orchestration for distributed systems",
      track: "AI, Generative Agents & Automation",
      submissionId: "SUB-IHUB-9812",
      timestamp: "Sunday, Dec 14 at 11:42 AM IST",
      githubUrl: "https://github.com/neuralvoyage/autoagent",
      demoUrl: "https://devpost.com/software/autoagent-omni",
      judgingSchedule: "Judging begins at 01:30 PM IST at i-Hub Presentation Hall 2 (Navrangpura, Ahmedabad).",
      hackathonName: "i-Hub Gujarat Innovation Hackathon 2026",
    },
    subject: "🚀 Submission Confirmed: AutoAgent Omni-Workflow — i-Hub Hackathon 2026",
  },
  "otp": {
    label: "Verification OTP Code",
    badge: "Security",
    icon: "🔐",
    Component: HackathonOtpEmail,
    defaultProps: {
      participantName: "Hacker",
      code: "729 415",
      expiresInMinutes: 10,
      hackathonName: "i-Hub Gujarat Innovation Hackathon 2026",
    },
    subject: "🔐 729 415 is your i-Hub Hackathon verification code",
  },
};

async function getTemplateHtml(templateName, query) {
  const entry = TEMPLATES[templateName] || TEMPLATES["apply-hackathon"];
  const props = { ...entry.defaultProps };

  if (query.recipientName)   props.recipientName   = query.recipientName;
  if (query.participantName) props.participantName = query.participantName;
  if (query.registrationId)  props.registrationId  = query.registrationId;
  if (query.teamName)        props.teamName        = query.teamName;
  if (query.track)           props.track           = query.track;
  if (query.code)            props.code            = query.code;
  if (query.projectName)     props.projectName     = query.projectName;
  if (query.hackathonName)   props.hackathonName   = query.hackathonName;
  if (query.expiresInMinutes) props.expiresInMinutes = Number(query.expiresInMinutes);

  return await renderEmail(entry.Component, props);
}

function setSecurityHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (e) {
        reject(new Error("Invalid JSON"));
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

  const reqUrl   = new URL(req.url, `http://${req.headers.host || "localhost:3000"}`);
  const pathname = reqUrl.pathname;
  const query    = Object.fromEntries(reqUrl.searchParams.entries());
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

  // ── Registration Portal Mount: /portal ──
  if (pathname === "/portal" || pathname === "/portal/" || pathname === "/portal/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(getPortalHtml());
    return;
  }

  // ── Secured RSVP 2-Step Portal: /rsvp ──
  if (pathname === "/rsvp" || pathname === "/rsvp/" || pathname === "/rsvp/index.html") {
    try {
      const rsvpHtml = fs.readFileSync(path.join(__dirname, "rsvp.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(rsvpHtml);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("RSVP Page Error: " + err.message);
    }
    return;
  }

  // ── RSVP API: Verify Step 1 Gate ──
  if (pathname === "/api/rsvp/verify" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const regId = (data.registrationId || "").trim();
      const email = (data.email || "").trim().toLowerCase();

      if (!regId || !email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Please enter your Registration ID and Email." }));
        return;
      }

      const reg = await db.findRegistrationByIdOrEmail(regId);
      if (!reg || reg.email.toLowerCase() !== email) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Credentials do not match our records." }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, registration: reg }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ── RSVP API: Confirm Step 2 & Dispatch Final Boarding Pass (Stage 5) ──
  if (pathname === "/api/rsvp/confirm" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const regId = (data.registrationId || "").trim();
      const laptopSerial = (data.laptopSerial || "").trim();
      const arrivalTime = (data.arrivalTime || "").trim();

      if (!regId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Missing Registration ID." }));
        return;
      }

      const booth = "Booth #" + String.fromCharCode(65 + Math.floor(Math.random() * 6)) + "-" + (10 + Math.floor(Math.random() * 40));

      const updated = await db.updateRegistration(regId, {
        status: "Confirmed_RSVP",
        rsvpCompleted: true,
        rsvpConfirmedAt: new Date(),
        laptopSerial,
        arrivalTime,
        boothNumber: booth,
      });

      if (!updated) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Registration not found to update." }));
        return;
      }

      // Automatically dispatch Stage 5 Email with attached Master Boarding Pass PDF!
      sendHackathonFinalPassEmail({
        to: updated.email,
        participantName: updated.participantName,
        registrationId: updated.registrationId,
        teamName: updated.teamName || "Solo",
        track: updated.track,
        boothNumber: booth,
        foodPreference: updated.foodPreference || "Pure Vegetarian",
        college: updated.college || "Gujarat University",
        service: "resend",
      }).catch(e => console.error("[RSVP] Final pass email dispatch error:", e));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, registration: updated }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ── Portal API: Request OTP ──
  if (pathname === "/portal/api/request-otp" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const email = (data.email || "").trim().toLowerCase();

      if (!isValidEmail(email)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Please enter a valid email address." }));
        return;
      }

      if (!data.participantName || data.participantName.trim().length < 2) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Participant name is required (min 2 characters)." }));
        return;
      }

      const rateCheckIp = checkRateLimit(`otp:ip:${clientIp}`, 5, 5 * 60 * 1000);
      if (!rateCheckIp.allowed) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: `Too many requests. Please wait ${rateCheckIp.retryAfterSeconds}s.` }));
        return;
      }

      const rateCheckEmail = checkRateLimit(`otp:email:${email}`, 3, 5 * 60 * 1000);
      if (!rateCheckEmail.allowed) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: `Too many OTP requests. Please wait ${rateCheckEmail.retryAfterSeconds}s.` }));
        return;
      }

      const { token, rawOtp, expiresAt } = createOtpSession(email, data);

      await sendHackathonOtpEmail({
        to: email,
        participantName: data.participantName,
        code: rawOtp,
        expiresInMinutes: 10,
        service: "nodemailer",
      });

      console.log(`[Portal] Verification OTP generated for ${email}: ${rawOtp}`);

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

  // ── Portal API: Verify & Register ──
  if (pathname === "/portal/api/verify-and-register" && req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const { token, otp } = data;

      if (!token || !otp) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Missing session token or verification code." }));
        return;
      }

      const verifyResult = verifyOtp(token, otp);
      if (!verifyResult.success) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: verifyResult.error }));
        return;
      }

      const finalResult = await finalizeRegistration(token);
      if (!finalResult.success) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: finalResult.error }));
        return;
      }

      const reg = finalResult.registration;

      // Automatically dispatch Stage 3: Official Registration Confirmation Dossier Email with 4 PDFs!
      sendHackathonDossierEmail({
        to: reg.email,
        participantName: reg.participantName,
        registrationId: reg.registrationId,
        teamName: reg.teamName || "Solo",
        track: reg.track,
        foodPreference: reg.foodPreference || "Pure Vegetarian",
        parentName: (reg.parentalApproval && reg.parentalApproval.parentName) || "",
        parentPhone: (reg.parentalApproval && reg.parentalApproval.parentPhone) || "",
        college: reg.college || "Gujarat University",
        service: "resend",
      }).catch(e => console.error("[Portal] Confirmation dispatch error:", e));

      // Invite teammates if team mode
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach(tm => {
          const mEmail = typeof tm === "string" ? tm : tm.email;
          if (isValidEmail(mEmail)) {
            sendHackathonTeamInviteEmail({
              to: mEmail,
              inviterName: reg.participantName,
              teamName: reg.teamName,
              track: reg.track,
              service: "resend",
            }).catch(e => console.error("[Portal] Teammate invite error:", e));
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

  // ── Portal API: Lookup ──
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

  // ── Template Live Render (Studio) ──
  if (pathname === "/api/render") {
    try {
      const template = query.template || "apply-hackathon";
      const { html } = await getTemplateHtml(template, query);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Render Error: " + err.message);
    }
    return;
  }

  // ── Download PDF Pass ──
  if (pathname === "/api/hackathon/download-pass") {
    try {
      const pdfBuffer = await generateHackathonPass({
        participantName: query.participantName || "Alex Rivera",
        registrationId: query.registrationId || "IHUB-2026-9842",
        teamName: query.teamName || "NeuralVoyage",
        track: query.track || "AI, Generative Agents & Automation",
        hackathonName: query.hackathonName || "i-Hub Gujarat Innovation Hackathon 2026",
      });

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${query.registrationId || "IHUB-2026-9842"}-iHub-Pass.pdf"`,
        "Content-Length": pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("PDF Generation Error: " + err.message);
    }
    return;
  }

  // ── Studio Live Dispatcher ──
  if (pathname === "/api/send" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body || "{}");
        const {
          template,
          service = "nodemailer",
          recipient,
          recipientName,
          participantName,
          registrationId,
          teamName,
          track,
          projectName,
          code,
          attachPass,
        } = data;

        const targetEmail = recipient || process.env.GMAIL_USER;
        if (!targetEmail) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Recipient email is required." }));
          return;
        }

        let result;
        if (template === "apply-hackathon") {
          result = await sendHackathonApplicationInviteEmail({
            to: targetEmail,
            recipientName: recipientName || participantName || "Innovator",
            portalUrl: `http://${req.headers.host || "localhost:3000"}/portal`,
            service,
          });
        } else if (template === "dossier") {
          result = await sendHackathonDossierEmail({
            to: targetEmail,
            participantName: participantName || "Alex Rivera",
            registrationId: registrationId || "IHUB-2026-9842",
            teamName: teamName || "NeuralVoyage",
            track: track || "AI, Generative Agents & Automation",
            foodPreference: "Pure Vegetarian",
            service,
          });
        } else if (template === "shortlist-rsvp") {
          result = await sendHackathonShortlistEmail({
            to: targetEmail,
            participantName: participantName || "Alex Rivera",
            registrationId: registrationId || "IHUB-2026-9842",
            teamName: teamName || "NeuralVoyage",
            track: track || "AI, Generative Agents & Automation",
            rsvpToken: "SAMPLE_RSVP_TOKEN",
            baseUrl: `http://${req.headers.host || "localhost:3000"}`,
            service,
          });
        } else if (template === "final-pass") {
          result = await sendHackathonFinalPassEmail({
            to: targetEmail,
            participantName: participantName || "Alex Rivera",
            registrationId: registrationId || "IHUB-2026-9842",
            teamName: teamName || "NeuralVoyage",
            track: track || "AI, Generative Agents & Automation",
            boothNumber: "Lab 3 - Table B-14",
            service,
          });
        } else if (template === "registration" || !template) {
          result = await sendHackathonRegistrationEmail({
            to: targetEmail,
            participantName: participantName || "Alex Rivera",
            registrationId: registrationId || "IHUB-2026-9842",
            teamName: teamName || "NeuralVoyage",
            track: track || "AI, Generative Agents & Automation",
            attachPass: attachPass !== false,
            service,
          });
        } else if (template === "team-invite") {
          result = await sendHackathonTeamInviteEmail({
            to: targetEmail,
            inviteeName: participantName || "Dev Hacker",
            teamName: teamName || "CyberSynthetics",
            track: track || "AI, Generative Agents & Automation",
            service,
          });
        } else if (template === "accepted") {
          result = await sendHackathonAcceptanceEmail({
            to: targetEmail,
            participantName: participantName || "Jordan Hayes",
            service,
          });
        } else if (template === "submission") {
          result = await sendHackathonSubmissionEmail({
            to: targetEmail,
            participantName: participantName || "Dev Hacker",
            teamName: teamName || "NeuralVoyage",
            projectName: projectName || "AutoAgent Omni-Workflow",
            track: track || "AI, Generative Agents & Automation",
            service,
          });
        } else if (template === "otp") {
          result = await sendHackathonOtpEmail({
            to: targetEmail,
            participantName: participantName || "Hacker",
            code: code || "729415",
            service,
          });
        }

        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: `Email successfully dispatched to ${targetEmail}!` }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: result.error?.message || "Failed to send." }));
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ── Frontend Studio UI ──
  if (pathname === "/" || pathname === "/index.html") {
    const defaultRecipient = process.env.GMAIL_USER || "";

    const templateButtons = Object.entries(TEMPLATES).map(([key, t], i) => `
      <button class="template-btn ${i === 0 ? "active" : ""}"
              data-template="${key}"
              onclick="selectTemplate('${key}', this)">
        <span>${t.icon} ${t.label}</span>
        <span class="template-badge">${t.badge}</span>
      </button>`).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>i-Hub Ahmedabad — Hackathon Mail & Registration Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg:          #f1f5f9;
      --sidebar-bg:  #ffffff;
      --card-bg:     #f8fafc;
      --border:      #e2e8f0;
      --border-dark: #cbd5e1;
      --text:        #0f172a;
      --text-dim:    #64748b;
      --primary:     #4f46e5;
      --primary-light:#eef2ff;
      --primary-dark:#4338ca;
      --emerald:     #059669;
      --preview-bg:  #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; }
    body { background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }

    .sidebar {
      width: 350px; min-width: 350px; background: var(--sidebar-bg);
      border-right: 1px solid var(--border); display: flex; flex-direction: column;
      overflow-y: auto;
    }
    .brand {
      padding: 18px 22px 14px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand-left { display: flex; align-items: center; gap: 12px; }
    .brand-mark {
      width: 38px; height: 38px; background: linear-gradient(135deg, #4f46e5, #06b6d4);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 900; color: #fff; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    }
    .brand-text-main { font-size: 14.5px; font-weight: 800; letter-spacing: -0.2px; color: #0f172a; }
    .brand-text-sub  { font-size: 10.5px; color: var(--primary); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 1px; }

    .portal-link-btn {
      background: var(--primary); color: #ffffff; text-decoration: none; padding: 6px 12px;
      border-radius: 6px; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;
      transition: background 0.15s;
    }
    .portal-link-btn:hover { background: var(--primary-dark); }

    .sidebar-section { padding: 16px 22px; border-bottom: 1px solid var(--border); }
    .section-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-dim); margin-bottom: 10px; }

    .template-btn {
      width: 100%; background: #ffffff; border: 1.5px solid var(--border);
      border-radius: 8px; padding: 10px 12px; color: var(--text); text-align: left;
      cursor: pointer; font-size: 13px; font-weight: 600; display: flex;
      align-items: center; justify-content: space-between; transition: all 0.15s; margin-bottom: 6px;
    }
    .template-btn:last-child { margin-bottom: 0; }
    .template-btn:hover { border-color: var(--primary); background: var(--primary-light); }
    .template-btn.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary-dark); font-weight: 700; }
    .template-badge { font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: #f1f5f9; color: #475569; }
    .template-btn.active .template-badge { background: #c7d2fe; color: #3730a3; }

    .form-group { margin-bottom: 10px; }
    .form-group label { font-size: 11.5px; font-weight: 700; color: var(--text-dim); display: block; margin-bottom: 4px; }
    .form-group input, .form-group select {
      width: 100%; background: #f8fafc; border: 1.5px solid var(--border);
      border-radius: 7px; padding: 8px 11px; color: #0f172a; font-size: 12.5px; outline: none;
      font-family: inherit; transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group select:focus { border-color: var(--primary); background: #ffffff; }

    .btn-row { display: flex; gap: 8px; margin-top: 8px; }
    .action-btn {
      flex: 1; padding: 11px; border-radius: 8px; font-weight: 700; font-size: 12.5px;
      cursor: pointer; transition: all 0.2s; border: none; text-align: center; text-decoration: none;
    }
    .btn-send { background: #4f46e5; color: #fff; }
    .btn-send:hover { background: #4338ca; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
    .btn-pass { background: #ffffff; color: #0f172a; border: 1.5px solid var(--border-dark); }
    .btn-pass:hover { background: #f8fafc; border-color: #94a3b8; }

    .preview-container { flex: 1; display: flex; flex-direction: column; background: var(--preview-bg); overflow: hidden; }
    .topbar {
      padding: 12px 24px; background: #ffffff; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .topbar-info { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 700; color: #0f172a; }
    .live-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 6px #10b981; }
    .device-tabs { display: flex; gap: 6px; background: #f1f5f9; padding: 3px; border-radius: 6px; }
    .device-tab {
      background: none; border: none; color: #64748b; padding: 5px 12px; border-radius: 4px;
      font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .device-tab.active { background: #ffffff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

    .iframe-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; padding: 24px; overflow: auto; }
    iframe {
      width: 100%; height: 100%; border: 1px solid #cbd5e1; border-radius: 12px;
      background: #ffffff; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); transition: width 0.25s ease;
    }
    iframe.mobile { width: 390px; height: 844px; border: 8px solid #334155; border-radius: 28px; }

    #toast {
      position: fixed; bottom: 20px; right: 20px; padding: 12px 20px; border-radius: 8px;
      font-size: 13px; font-weight: 600; z-index: 1000; display: none;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
    }
    #toast.success { background: #065f46; color: #ecfdf5; border: 1px solid #059669; }
    #toast.error   { background: #991b1b; color: #fef2f2; border: 1px solid #dc2626; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="brand">
      <div class="brand-left">
        <div class="brand-mark">🏛️</div>
        <div>
          <div class="brand-text-main">i-HUB AHMEDABAD</div>
          <div class="brand-text-sub">Hackathon Mail Studio</div>
        </div>
      </div>
      <a href="/portal" target="_blank" class="portal-link-btn" title="Open the Secured Registration Portal">
        Portal ↗
      </a>
    </div>

    <div class="sidebar-section">
      <div class="section-label">Hackathon Flow</div>
      <div id="template-list">${templateButtons}</div>
    </div>

    <div class="sidebar-section">
      <div class="section-label">Customize Props</div>
      <div class="form-group">
        <label>Participant / Innovator Name</label>
        <input type="text" id="propName" value="Alex Rivera" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Registration / Pass ID</label>
        <input type="text" id="propRegId" value="IHUB-2026-9842" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Team Squad</label>
        <input type="text" id="propTeam" value="NeuralVoyage" oninput="updatePreview()" />
      </div>
      <div class="form-group">
        <label>Challenge Track</label>
        <select id="propTrack" onchange="updatePreview()">
          <option value="AI, Generative Agents & Automation">AI, Generative Agents & Automation</option>
          <option value="Smart Cities & Urban Mobility">Smart Cities & Urban Mobility</option>
          <option value="FinTech & Next-Gen Digital Payments">FinTech & Next-Gen Digital Payments</option>
          <option value="AgriTech & Climate Solutions">AgriTech & Climate Solutions</option>
          <option value="Healthcare & DeepTech Innovations">Healthcare & DeepTech Innovations</option>
        </select>
      </div>
      <div class="form-group">
        <label>Verification OTP Code</label>
        <input type="text" id="propCode" value="729 415" oninput="updatePreview()" />
      </div>
    </div>

    <div class="sidebar-section">
      <div class="section-label">Test Email Dispatch</div>
      <div class="form-group">
        <label>Recipient Email</label>
        <input type="email" id="testEmail" value="${defaultRecipient}" placeholder="innovator@example.com" />
      </div>
      <div class="form-group">
        <label>Delivery Provider</label>
        <select id="mailService">
          <option value="nodemailer">Nodemailer (Gmail SMTP)</option>
          <option value="resend">Resend HTTP API</option>
        </select>
      </div>
      <div class="form-group">
        <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-weight:600; color: #334155;">
          <input type="checkbox" id="attachPassCheckbox" checked style="width:auto; margin:0;" />
          Attach Official i-Hub PDF Pass
        </label>
      </div>

      <div class="btn-row">
        <button class="action-btn btn-send" id="sendBtn" onclick="sendTestEmail()">
          📤 Send Test Email
        </button>
      </div>
      <div class="btn-row" style="margin-top: 6px;">
        <a class="action-btn btn-pass" id="downloadPassBtn" href="#" onclick="downloadPass(event)">
          🎟️ Download i-Hub PDF Pass
        </a>
      </div>
    </div>
  </div>

  <div class="preview-container">
    <div class="topbar">
      <div class="topbar-info">
        <div class="live-dot"></div>
        <span id="activeTemplateTitle">Apply for Hackathon @ i-Hub</span>
      </div>
      <div class="device-tabs">
        <button class="device-tab active" onclick="setDevice('desktop', this)">🖥️ Desktop</button>
        <button class="device-tab" onclick="setDevice('mobile', this)">📱 Mobile</button>
      </div>
    </div>

    <div class="iframe-wrapper">
      <iframe id="previewFrame" src="/api/render?template=apply-hackathon"></iframe>
    </div>
  </div>

  <div id="toast"></div>

  <script>
    let currentTemplate = 'apply-hackathon';

    function selectTemplate(key, btn) {
      document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTemplate = key;
      document.getElementById('activeTemplateTitle').textContent = btn.querySelector('span').textContent;
      updatePreview();
    }

    function setDevice(device, btn) {
      document.querySelectorAll('.device-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const frame = document.getElementById('previewFrame');
      if (device === 'mobile') {
        frame.classList.add('mobile');
      } else {
        frame.classList.remove('mobile');
      }
    }

    function updatePreview() {
      const name = encodeURIComponent(document.getElementById('propName').value);
      const regId = encodeURIComponent(document.getElementById('propRegId').value);
      const team = encodeURIComponent(document.getElementById('propTeam').value);
      const track = encodeURIComponent(document.getElementById('propTrack').value);
      const code = encodeURIComponent(document.getElementById('propCode').value);

      const url = '/api/render?template=' + currentTemplate +
        '&participantName=' + name +
        '&recipientName=' + name +
        '&registrationId=' + regId +
        '&teamName=' + team +
        '&track=' + track +
        '&code=' + code;

      document.getElementById('previewFrame').src = url;
    }

    function downloadPass(e) {
      e.preventDefault();
      const name = encodeURIComponent(document.getElementById('propName').value);
      const regId = encodeURIComponent(document.getElementById('propRegId').value);
      const team = encodeURIComponent(document.getElementById('propTeam').value);
      const track = encodeURIComponent(document.getElementById('propTrack').value);

      window.location.href = '/api/hackathon/download-pass?' +
        'participantName=' + name +
        '&registrationId=' + regId +
        '&teamName=' + team +
        '&track=' + track;
    }

    async function sendTestEmail() {
      const btn = document.getElementById('sendBtn');
      const recipient = document.getElementById('testEmail').value.trim();
      const service = document.getElementById('mailService').value;
      const attachPass = document.getElementById('attachPassCheckbox').checked;

      if (!recipient) {
        showToast('Please enter a recipient email address.', 'error');
        return;
      }

      btn.disabled = true;
      btn.textContent = '⏳ Sending...';

      try {
        const payload = {
          template: currentTemplate,
          service,
          recipient,
          recipientName: document.getElementById('propName').value,
          participantName: document.getElementById('propName').value,
          registrationId: document.getElementById('propRegId').value,
          teamName: document.getElementById('propTeam').value,
          track: document.getElementById('propTrack').value,
          code: document.getElementById('propCode').value,
          attachPass,
        };

        const res = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          showToast('✅ ' + data.message, 'success');
        } else {
          showToast('❌ ' + (data.error || 'Failed to send'), 'error');
        }
      } catch (err) {
        showToast('❌ Network error: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '📤 Send Test Email';
      }
    }

    function showToast(msg, type) {
      const t = document.getElementById('toast');
      t.className = type;
      t.textContent = msg;
      t.style.display = 'block';
      setTimeout(() => { t.style.display = 'none'; }, 5000);
    }
  </script>
</body>
</html>`;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

let currentPort = Number(PORT);

function listen(port) {
  server.listen(port, () => {
    console.log(`\n🏛️ i-Hub Ahmedabad Hackathon Mail Studio running at http://localhost:${port}`);
    console.log(`🔒 Secured Registration Portal available at http://localhost:${port}/portal\n`);
  });
}

server.on("error", err => {
  if (err.code === "EADDRINUSE") {
    currentPort += 1;
    console.log(`Port in use, trying http://localhost:${currentPort}...`);
    listen(currentPort);
  } else {
    console.error("Server error:", err);
  }
});

async function startServer() {
  await db.initDatabase();
  listen(currentPort);
}

startServer();
