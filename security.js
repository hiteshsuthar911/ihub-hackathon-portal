const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const db = require("./db");

// ── In-Memory Security Stores ──
const otpSessions = new Map(); // token -> { email, hashedOtp, salt, expiresAt, attempts, verified, pendingData }
const rateLimitMap = new Map(); // key -> [timestamps]

/**
 * Generate cryptographically secure 6-digit numeric OTP
 */
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash an OTP using SHA-256 with a unique salt
 */
function hashOtp(otp, salt) {
  return crypto.createHmac("sha256", salt).update(otp).digest("hex");
}

/**
 * Generate a secure 32-byte session token
 */
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Sanitize text input to prevent XSS and HTML injection
 */
function sanitize(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[&<>"'/]/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
      };
      return map[char] || char;
    })
    .slice(0, 1000); // enforce maximum length
}

/**
 * Email validation using standard pattern
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim()) && email.length <= 254;
}

/**
 * Phone number validation (Indian 10-digit mobile or international E.164)
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-().]/g, "");
  // Matches Indian 10-digit (+91/0 optional) or general international 10-15 digits
  return /^(\+?91|0)?[6-9]\d{9}$/.test(cleaned) || /^\+?[0-9]{10,15}$/.test(cleaned);
}

/**
 * Rate Limiter (sliding window algorithm)
 */
function checkRateLimit(key, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  if (key.includes("127.0.0.1") || key.includes("::1") || key.includes("localhost")) {
    maxRequests = Math.max(maxRequests, 100);
  }

  const timestamps = rateLimitMap.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Create a new Dual-OTP verification session (Candidate + Parent)
 */
function createOtpSession(candidateEmail, pendingData) {
  const cleanCandidateEmail = candidateEmail.trim().toLowerCase();
  const parentEmail = (pendingData.parentEmail || "").trim().toLowerCase();

  const rawCandidateOtp = generateOtp();
  const candidateSalt = crypto.randomBytes(16).toString("hex");
  const hashedCandidateOtp = hashOtp(rawCandidateOtp, candidateSalt);

  const rawParentOtp = generateOtp();
  const parentSalt = crypto.randomBytes(16).toString("hex");
  const hashedParentOtp = hashOtp(rawParentOtp, parentSalt);

  const token = generateSessionToken();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpSessions.set(token, {
    email: cleanCandidateEmail,
    parentEmail: parentEmail || cleanCandidateEmail,
    hashedCandidateOtp,
    candidateSalt,
    hashedParentOtp,
    parentSalt,
    expiresAt,
    attempts: 0,
    verifiedCandidate: false,
    verifiedParent: false,
    verified: false,
    pendingData,
  });

  return {
    token,
    rawCandidateOtp,
    rawParentOtp,
    expiresAt,
  };
}

/**
 * Verify both candidate OTP and parent OTP against session token
 */
function verifyDualOtp(token, candidateOtp, parentOtp) {
  const session = otpSessions.get(token);

  if (!session) {
    return { success: false, error: "Invalid or expired session. Please request new verification codes." };
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(token);
    return { success: false, error: "Verification codes have expired. Please request new codes." };
  }

  if (session.attempts >= 5) {
    otpSessions.delete(token);
    return { success: false, error: "Maximum attempts exceeded. Please request new verification codes." };
  }

  session.attempts += 1;

  // 1. Verify Candidate OTP
  const candHash = hashOtp(candidateOtp.trim(), session.candidateSalt);
  const candValid =
    candHash.length === session.hashedCandidateOtp.length &&
    crypto.timingSafeEqual(Buffer.from(candHash), Buffer.from(session.hashedCandidateOtp));

  // 2. Verify Parent OTP
  const parentHash = hashOtp(parentOtp.trim(), session.parentSalt);
  const parentValid =
    parentHash.length === session.hashedParentOtp.length &&
    crypto.timingSafeEqual(Buffer.from(parentHash), Buffer.from(session.hashedParentOtp));

  if (!candValid && !parentValid) {
    const rem = 5 - session.attempts;
    return { success: false, error: `Both Candidate OTP and Parent OTP are incorrect. ${rem} attempt(s) remaining.` };
  }

  if (!candValid) {
    const rem = 5 - session.attempts;
    return { success: false, error: `Candidate verification code is incorrect. ${rem} attempt(s) remaining.` };
  }

  if (!parentValid) {
    const rem = 5 - session.attempts;
    return { success: false, error: `Parent / Guardian verification code is incorrect. ${rem} attempt(s) remaining.` };
  }

  session.verified = true;
  session.verifiedCandidate = true;
  session.verifiedParent = true;

  return {
    success: true,
    email: session.email,
    parentEmail: session.parentEmail,
    pendingData: session.pendingData,
  };
}

// Keep verifyOtp for backwards compatibility
function verifyOtp(token, submittedOtp) {
  return verifyDualOtp(token, submittedOtp, submittedOtp);
}

/**
 * Complete and persist registration once verified (using db.js)
 */
async function finalizeRegistration(token) {
  const session = otpSessions.get(token);
  if (!session || !session.verified) {
    return { success: false, error: "Session must be verified before finalizing registration." };
  }

  const email = session.email;

  // Check duplicate
  const existing = await db.findRegistrationByIdOrEmail(email);
  if (existing) {
    otpSessions.delete(token);
    return {
      success: true,
      alreadyRegistered: true,
      registration: existing,
    };
  }

  // Generate unique Registration Pass ID: IHUB-2026-XXXX
  const randomSuffix = crypto.randomInt(1000, 9999);
  const registrationId = `IHUB-2026-${randomSuffix}`;
  const rsvpToken = crypto.randomBytes(24).toString("hex");

  const record = {
    registrationId,
    email,
    participantName: sanitize(session.pendingData.participantName || "Innovator"),
    phone: sanitize(session.pendingData.phone || ""),
    college: sanitize(session.pendingData.college || ""),
    githubUrl: sanitize(session.pendingData.githubUrl || ""),
    linkedinUrl: sanitize(session.pendingData.linkedinUrl || ""),
    participationType: session.pendingData.participationType === "team" ? "team" : "solo",
    teamName: sanitize(session.pendingData.teamName || (session.pendingData.participationType === "team" ? "Squad" : "Solo")),
    teamMembers: Array.isArray(session.pendingData.teamMembers)
      ? session.pendingData.teamMembers.map((m) => (typeof m === "string" ? { name: "", email: sanitize(m) } : { name: sanitize(m.name || ""), email: sanitize(m.email || "") })).filter((t) => t.email)
      : [],
    track: sanitize(session.pendingData.track || "AI, Generative Agents & Automation"),
    projectAbstract: sanitize(session.pendingData.projectAbstract || ""),
    foodPreference: sanitize(session.pendingData.foodPreference || "Pure Vegetarian"),
    securityAgreed: Boolean(session.pendingData.securityAgreed !== false),
    parentalApproval: {
      parentName: sanitize(session.pendingData.parentName || (session.pendingData.parentalApproval && session.pendingData.parentalApproval.parentName) || ""),
      parentEmail: sanitize(session.pendingData.parentEmail || (session.pendingData.parentalApproval && session.pendingData.parentalApproval.parentEmail) || ""),
      parentPhone: sanitize(session.pendingData.parentPhone || (session.pendingData.parentalApproval && session.pendingData.parentalApproval.parentPhone) || ""),
      relationship: sanitize(session.pendingData.relationship || (session.pendingData.parentalApproval && session.pendingData.parentalApproval.relationship) || "Guardian"),
      agreed: Boolean(session.pendingData.parentAgreed !== false),
      verifiedByOtp: true,
    },
    status: "Registered",
    rsvpToken,
    rsvpCompleted: false,
    registeredAt: new Date(),
  };

  const saved = await db.saveRegistration(record);
  otpSessions.delete(token);

  return {
    success: true,
    alreadyRegistered: false,
    registration: saved,
  };
}

/**
 * Lookup registration by email or ID
 */
async function findRegistration(identifier) {
  return await db.findRegistrationByIdOrEmail(identifier);
}

module.exports = {
  sanitize,
  isValidEmail,
  isValidPhone,
  checkRateLimit,
  createOtpSession,
  verifyOtp,
  verifyDualOtp,
  finalizeRegistration,
  findRegistration,
};
