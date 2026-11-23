const fs = require("fs");
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
const { sendMailWithNodemailer, sendMailWithResend } = require("./sendMail");
const { generateHackathonPass } = require("./generateHackathonPass");
const {
  generateRegistrationReceiptPdf,
  generateFoodPassPdf,
  generateSecurityUndertakingPdf,
  generateParentalConsentPdf,
  generateOfficialHackerPassPdf,
} = require("./generateHackathonDossier");

/**
 * Dispatch an email via the selected provider (Nodemailer Gmail SMTP or Resend API)
 */
async function dispatchMail(mailData, service = "resend") {
  // If service is resend, use sendMailWithResend; fallback to nodemailer if resend fails or vice versa
  if (service === "resend") {
    const res = await sendMailWithResend(mailData);
    if (res.success) return res;
    console.warn("[hackathonMailer] Resend failed, falling back to Nodemailer:", res.error);
    return await sendMailWithNodemailer(mailData);
  }
  return await sendMailWithNodemailer(mailData);
}

/**
 * ── STAGE 1: Call for Innovators / Application Invite Email ──
 * Sent to invite participants with link to the secured portal.
 */
async function sendHackathonApplicationInviteEmail({
  to,
  recipientName = "Innovator",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  organizer = "i-Hub (Gujarat Student Startup & Innovation Hub)",
  venue = "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
  eventDates = "December 15, 09:00 AM – December 16, 12:30 PM",
  applicationDeadline = "December 10, 2026 at 11:59 PM IST",
  portalUrl = "http://localhost:3000/portal",
  guideUrl = "https://ihubgujarat.in/hackathon/guidelines",
  prizePool = "₹10,00,000+ & Incubation Grants",
  service = "resend",
}) {
  if (!to) throw new Error("Missing required 'to' email address");

  const { html, text } = await renderEmail(HackathonApplicationInviteEmail, {
    recipientName,
    hackathonName,
    organizer,
    venue,
    eventDates,
    applicationDeadline,
    applyUrl: portalUrl,
    guideUrl,
    prizePool,
  });

  const mailData = {
    to,
    subject: `🚀 Invitation: Apply for ${hackathonName} @ i-Hub Ahmedabad`,
    text,
    html,
  };

  return await dispatchMail(mailData, service);
}

/**
 * ── STAGE 2 OTP Email: Plain-Text Candidate Verification ──
 * "make the mail format should be just simple text format and no design nothing"
 */
async function sendCandidatePlainTextOtp({
  to,
  participantName = "Innovator",
  code = "123456",
  expiresInMinutes = 10,
  service = "resend",
}) {
  if (!to) throw new Error("Missing recipient email");

  const text = `i-Hub Gujarat Innovation Hackathon 2026
Navrangpura, Ahmedabad

Hello ${participantName},

Your verification OTP is: ${code}

This code is valid for ${expiresInMinutes} minutes.
Enter this code along with your parent/guardian verification code on the registration portal to verify your application.

If you did not request this, please ignore this email.

--
i-Hub Event Cell
Gujarat Student Startup & Innovation Hub
Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015`;

  const mailData = {
    to,
    subject: `Your i-Hub Hackathon Verification Code: ${code}`,
    text,
  };

  return await dispatchMail(mailData, service);
}

/**
 * ── STAGE 2 OTP Email: Plain-Text Parent / Guardian Verification ──
 * Sent directly to parent's email address
 */
async function sendParentPlainTextOtp({
  to,
  parentName = "Parent / Guardian",
  participantName = "Candidate",
  code = "654321",
  expiresInMinutes = 10,
  service = "resend",
}) {
  if (!to) throw new Error("Missing parent email");

  const text = `i-Hub Gujarat Innovation Hackathon 2026
Navrangpura, Ahmedabad

Dear ${parentName},

Your child/ward, ${participantName}, is registering for the i-Hub Gujarat Innovation Hackathon (Dec 15 - 16, 2026).

To verify your parental/guardian consent for overnight on-campus participation, please provide them with your security code:

Your Parent Verification OTP is: ${code}

This code is valid for ${expiresInMinutes} minutes.
Both student code and parent code are required to complete the registration.

If you have questions, contact us at hackathon@ihubgujarat.in.

--
i-Hub Event Cell
Gujarat Student Startup & Innovation Hub
Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015`;

  const mailData = {
    to,
    subject: `Parental Consent Verification Code for ${participantName}: ${code}`,
    text,
  };

  return await dispatchMail(mailData, service);
}

/**
 * ── STAGE 3: Registration Confirmation & Comprehensive Dossier Email ──
 * Sent immediately after portal registration with all 4 PDF attachments:
 * 1. IHUB-Registration-Receipt.pdf
 * 2. IHUB-Food-Meal-Coupon-Pass.pdf
 * 3. IHUB-Campus-Security-Rules-Undertaking.pdf
 * 4. IHUB-Parental-Guardian-Consent-Form.pdf
 */
async function sendHackathonDossierEmail({
  to,
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "Solo",
  track = "AI, Generative Agents & Automation",
  foodPreference = "Pure Vegetarian",
  parentName = "Guardian",
  parentPhone = "",
  college = "Gujarat University",
  service = "resend",
}) {
  if (!to) throw new Error("Missing required 'to' email address");

  const { html, text } = await renderEmail(HackathonDossierEmail, {
    participantName,
    registrationId,
    teamName,
    track,
    foodPreference,
    parentName,
  });

  console.log(`[hackathonMailer] Generating 4 Dossier PDFs for ${participantName} (${registrationId})...`);

  // Generate all 4 required PDFs
  const [receiptBuf, foodBuf, securityBuf, consentBuf] = await Promise.all([
    generateRegistrationReceiptPdf({ participantName, registrationId, teamName, track, college }),
    generateFoodPassPdf({ participantName, registrationId, teamName, foodPreference }),
    generateSecurityUndertakingPdf({ participantName, registrationId, teamName, track }),
    generateParentalConsentPdf({ participantName, registrationId, teamName, parentName, parentPhone }),
  ]);

  const attachments = [
    {
      filename: `${registrationId}-Registration-Receipt.pdf`,
      content: receiptBuf,
      contentType: "application/pdf",
    },
    {
      filename: `${registrationId}-Food-Coupon-Pass.pdf`,
      content: foodBuf,
      contentType: "application/pdf",
    },
    {
      filename: `${registrationId}-Campus-Security-Undertaking.pdf`,
      content: securityBuf,
      contentType: "application/pdf",
    },
    {
      filename: `${registrationId}-Parental-Guardian-Consent.pdf`,
      content: consentBuf,
      contentType: "application/pdf",
    },
  ];

  const mailData = {
    to,
    subject: `📄 Dossier Confirmed: i-Hub Gujarat Innovation Hackathon 2026 [${registrationId}]`,
    text,
    html,
    attachments,
  };

  return await dispatchMail(mailData, service);
}

/**
 * ── STAGE 4: Shortlist Notification & 2-Page Secured RSVP Email ──
 * Sent with unique token link to /rsvp?token=...
 */
async function sendHackathonShortlistEmail({
  to,
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "NeuralVoyage",
  track = "AI, Generative Agents & Automation",
  rsvpToken = "",
  baseUrl = "http://localhost:3000",
  service = "resend",
}) {
  if (!to) throw new Error("Missing required 'to' email address");

  const rsvpUrl = `${baseUrl}/rsvp?token=${encodeURIComponent(rsvpToken)}&regId=${encodeURIComponent(registrationId)}`;

  const { html, text } = await renderEmail(HackathonShortlistRsvpEmail, {
    participantName,
    registrationId,
    teamName,
    track,
    rsvpUrl,
  });

  const mailData = {
    to,
    subject: `⭐ Shortlisted: Confirm Your Attendance for i-Hub Hackathon [${registrationId}]`,
    text,
    html,
  };

  return await dispatchMail(mailData, service);
}

/**
 * ── STAGE 5: Final Confirmation & Master Hacker Boarding Pass Email ──
 * Sent after 2-page RSVP is completed. Contains schedule, directions, booth,
 * and attached IHUB-Master-Hacker-Boarding-Pass.pdf.
 */
async function sendHackathonFinalPassEmail({
  to,
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "NeuralVoyage",
  track = "AI, Generative Agents & Automation",
  boothNumber = "Lab 3 - Table B-14",
  foodPreference = "Pure Vegetarian",
  college = "Gujarat University",
  service = "resend",
}) {
  if (!to) throw new Error("Missing required 'to' email address");

  const { html, text } = await renderEmail(HackathonFinalPassEmail, {
    participantName,
    registrationId,
    teamName,
    track,
    boothNumber,
    foodPreference,
  });

  console.log(`[hackathonMailer] Generating Master Boarding Pass PDF for ${participantName}...`);
  const masterPassBuf = await generateOfficialHackerPassPdf({
    participantName,
    registrationId,
    teamName,
    track,
    boothNumber,
    foodPreference,
    college,
  });

  const attachments = [
    {
      filename: `${registrationId}-Master-Hacker-Boarding-Pass.pdf`,
      content: masterPassBuf,
      contentType: "application/pdf",
    },
  ];

  const mailData = {
    to,
    subject: `🎟️ OFFICIAL HACKER BOARDING PASS: i-Hub Gujarat Innovation Hackathon [${registrationId}]`,
    text,
    html,
    attachments,
  };

  return await dispatchMail(mailData, service);
}

/**
 * Teammate Invitation Email
 */
async function sendHackathonTeamInviteEmail({
  to,
  inviterName = "Alex Rivera",
  teamName = "NeuralVoyage",
  track = "AI, Generative Agents & Automation",
  portalUrl = "http://localhost:3000/portal",
  service = "resend",
}) {
  if (!to) throw new Error("Missing required 'to' email address");

  const { html, text } = await renderEmail(HackathonTeamInviteEmail, {
    inviterName,
    teamName,
    track,
    inviteUrl: portalUrl,
  });

  const mailData = {
    to,
    subject: `🤝 Team Invitation: Join "${teamName}" at i-Hub Gujarat Hackathon`,
    text,
    html,
  };

  return await dispatchMail(mailData, service);
}

module.exports = {
  dispatchMail,
  sendHackathonApplicationInviteEmail,
  sendCandidatePlainTextOtp,
  sendParentPlainTextOtp,
  sendHackathonOtpEmail: sendCandidatePlainTextOtp,
  sendHackathonDossierEmail,
  sendHackathonShortlistEmail,
  sendHackathonFinalPassEmail,
  sendHackathonTeamInviteEmail,
  sendHackathonRegistrationEmail: sendHackathonDossierEmail, // alias for backwards compatibility
};
