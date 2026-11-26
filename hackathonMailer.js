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
  NationalCohortSelectionEmail,
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
  generateDelhiSaasNominationPdf,
  generateProjectStage1MeritPdf,
  generateStateRoundClearanceCertificate,
} = require("./generateHackathonDossier");

/**
 * Dispatch an email: Tries Resend first; if Resend blocks the recipient (e.g. 403 domain error),
 * instantly dispatches through Nodemailer so the user ALWAYS receives their email immediately!
 */
async function dispatchMail(mailData, service = "resend") {
  if (service === "resend" || !service) {
    const res = await sendMailWithResend(mailData);
    if (res.success) {
      return res;
    }
    console.warn(`[hackathonMailer] Resend did not deliver to ${mailData.to} (${(res.error && res.error.message) || 'Error'}). Instantly falling back to Gmail SMTP...`);
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

  const cleanName = (participantName || "").replace(/&amp;/g, "&");
  const cleanTrack = (track || "").replace(/&amp;/g, "&");
  const cleanCollege = (college || "").replace(/&amp;/g, "&");
  const cleanDiet = (foodPreference || "").replace(/&amp;/g, "&");
  const cleanParent = (parentName || "").replace(/&amp;/g, "&");

  const text = `GOVERNMENT OF GUJARAT
Gujarat Student Startup & Innovation Hub (i-Hub)
KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015

OFFICIAL REGISTRATION CONFIRMATION DOSSIER
Reference Number: ${registrationId}

Dear ${cleanName},

Your application for the i-Hub Gujarat Innovation Hackathon 2026 has been successfully verified and confirmed by the Admissions and Proctorial Board.

REGISTRATION DETAILS:
- Candidate Name: ${cleanName}
- Registration ID: ${registrationId}
- College / Institution: ${cleanCollege}
- Squad & Track: ${teamName} | ${cleanTrack}
- Food Plan: ${cleanDiet}
- Assigned Workspace: Booth #A-14 (Cluster 2)
- Parent / Guardian: ${cleanParent} (${parentPhone})
- Event Timings: December 15, 09:00 AM to December 16, 12:30 PM (27.5 Hours Non-stop)
- Venue: i-Hub Campus, Prajna Puram, Navrangpura, Ahmedabad 380015

ATTACHED OFFICIAL DOCUMENTS (PDF):
1. Official Registration Receipt & Admission Docket (2 Pages)
2. All-Inclusive 27.5-Hour Catering & Meal Coupon Pass (2 Pages)
3. Statutory Campus Security & Anti-Exit Undertaking (2 Pages)
4. Parental / Guardian Overnight Participation Consent Form (2 Pages)

MANDATORY REPORTING INSTRUCTIONS:
Please report in person at the i-Hub Ahmedabad Reception on Friday, December 15, 2026 between 08:30 AM and 09:30 AM IST. Please carry your original Government Photo ID (Aadhaar / Voter ID), College Student ID, and printed copies of the attached security undertaking and parental consent form.

Note: The campus boundary is strictly sealed throughout the 27.5-hour hackathon. Exiting campus premises without written permission from the Chief Proctor results in immediate permanent disqualification.

For assistance, reach the admissions desk at hackathon@ihubgujarat.in or call +91 79 2630 1234.

Sincerely,
Admissions & Scrutiny Board
Gujarat Student Startup & Innovation Hub (i-Hub)
Education Department, Government of Gujarat`;

  const html = `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #111827; max-width: 650px; margin: 0 auto; padding: 20px 0;">
<pre style="font-family: inherit; font-size: inherit; white-space: pre-wrap; margin: 0; line-height: 1.6; color: #111827;">${text}</pre>
</div>`;

  console.log(`[hackathonMailer] Generating 4 Dossier PDFs for ${participantName} (${registrationId})...`);

  // Generate all 4 required PDFs
  const [receiptBuf, foodBuf, securityBuf, consentBuf] = await Promise.all([
    generateRegistrationReceiptPdf({ participantName, registrationId, teamName, track, college, foodPreference, parentName, parentPhone }),
    generateFoodPassPdf({ participantName, registrationId, teamName, foodPreference }),
    generateSecurityUndertakingPdf({ participantName, registrationId, teamName, track, college }),
    generateParentalConsentPdf({ participantName, registrationId, teamName, parentName, parentPhone, college }),
  ]);

  const attachments = [
    {
      filename: `i-Hub_Registration_Receipt_${registrationId}.pdf`,
      content: receiptBuf,
      contentType: "application/pdf",
    },
    {
      filename: `i-Hub_Food_Pass_${registrationId}.pdf`,
      content: foodBuf,
      contentType: "application/pdf",
    },
    {
      filename: `i-Hub_Security_Undertaking_${registrationId}.pdf`,
      content: securityBuf,
      contentType: "application/pdf",
    },
    {
      filename: `i-Hub_Parental_Consent_${registrationId}.pdf`,
      content: consentBuf,
      contentType: "application/pdf",
    },
  ];

  const mailData = {
    to,
    subject: `Official Registration Dossier: i-Hub Gujarat Innovation Hackathon 2026 [${registrationId}]`,
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

/**
 * ── STAGE 4: National Cohort Selection & Stage 1 Merit Verdict Email ──
 * Sent to selected candidate with both PDF documents:
 * 1. Delhi Innovation & SaaS Acceleration Bootcamp Deputation Order
 * 2. Stage 1 Technical Evaluation Verdict & All-India Merit Directive
 */
async function sendNationalCohortSelectionEmail({
  to,
  participantName = "SUTHAR HITESH JAGDISH",
  registrationId = "IHUB-2026-6953",
  college = "Thakur College of Engineering and Technology",
  track = "FinTech & Next-Gen Enterprise SaaS",
  projectTitle = "Autonomous Enterprise Fraud Detection & High-Throughput Payment Orchestrator",
  score = "94.5 / 100 (Tier A+)",
  meritRank = "State Merit Rank #04 (Top 1.5% Percentile)",
  meritDispatchDate = "December 22, 2026 at 11:00 AM IST",
  campDates = "January 18, 2027 – January 22, 2027",
  service = "resend",
}) {
  if (!to) throw new Error("Missing required 'to' email address");

  console.log(`[hackathonMailer] Generating Delhi SaaS & Stage 1 Merit PDFs for ${participantName} (${registrationId})...`);

  const cleanName = (participantName || "").replace(/&amp;/g, "&");
  const cleanTrack = (track || "").replace(/&amp;/g, "&");
  const cleanCollege = (college || "").replace(/&amp;/g, "&");
  const cleanProject = (projectTitle || "").replace(/&amp;/g, "&");

  const [delhiPdf, meritPdf] = await Promise.all([
    generateDelhiSaasNominationPdf({
      participantName: cleanName,
      registrationId,
      college: cleanCollege,
      track: cleanTrack,
      projectTitle: cleanProject,
      campDates,
    }),
    generateProjectStage1MeritPdf({
      participantName: cleanName,
      registrationId,
      college: cleanCollege,
      track: cleanTrack,
      projectTitle: cleanProject,
      evaluationScore: score,
      meritRank,
      stage2EmailTarget: to,
      meritReleaseDate: meritDispatchDate,
    }),
  ]);

  const text = `GOVERNMENT OF GUJARAT & MeitY STARTUP HUB
Gujarat Student Startup & Innovation Hub (i-Hub)
National Innovation & Fellowships Directorate
Electronics Niketan, Lodhi Road, New Delhi & Prajna Puram, Ahmedabad

OFFICIAL SELECTION & NATIONAL DEPUTATION NOTICE
Reference: ${registrationId} / IHUB-DELHI-SAAS-2026-084

Dear ${cleanName},

We are pleased to inform you that following technical evaluation by the Central Technical Scrutiny Committee at i-Hub Ahmedabad, your project "${cleanProject}" has successfully cleared Stage 1 Technical Scrutiny with a score of ${score} (${meritRank}).

By virtue of this exemplary evaluation (ranking in the top 1.5% percentile), you have been officially deputed as a State Innovation Fellow to the Delhi Innovation & SaaS Acceleration Bootcamp in New Delhi (${campDates}) with 100% government sponsorship covering your residential accommodation, inter-state travel transit, and $5,000 USD enterprise cloud credits.

ALL-INDIA MERIT LIST DIRECTIVE:
Your project is now entered into the National Innovation Ledger. The consolidated All-India National Merit Rank List and Stage 2 Live VC Pitch Schedule will be dispatched directly to this registered email address on ${meritDispatchDate}.

ATTACHED OFFICIAL DOCUMENTS (PDF):
1. Official Nomination & State Deputation Order - Delhi Innovation & SaaS Camp (2 Pages)
2. Stage 1 Technical Evaluation Verdict & All-India Merit Directive (2 Pages)

Please review the attached PDF documents for the complete curriculum, logistical entitlements, and Stage 2 submission guidelines.

Sincerely,
Director of Innovation & Research
Gujarat Student Startup & Innovation Hub (i-Hub)
In Joint Mission with MeitY Startup Hub, New Delhi`;

  const html = `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #111827; max-width: 650px; margin: 0 auto; padding: 20px 0;">
<pre style="font-family: inherit; font-size: inherit; white-space: pre-wrap; margin: 0; line-height: 1.6; color: #111827;">${text}</pre>
</div>`;

  const mailData = {
    to,
    subject: `Official Deputation Order & Stage 1 Merit Verdict [${registrationId}] - i-Hub Gujarat`,
    text,
    html,
    attachments: [
      {
        filename: `i-Hub_Delhi_Saas_Nomination_Order_${registrationId}.pdf`,
        content: delhiPdf,
      },
      {
        filename: `i-Hub_Stage1_Technical_Merit_Verdict_${registrationId}.pdf`,
        content: meritPdf,
      },
    ],
  };

  return await dispatchMail(mailData, service);
}

async function sendStateRoundCertificateEmail({
  to,
  participantName,
  registrationId,
  college,
  track,
  stateRank = "04",
  score = "94.5 / 100",
  percentile = "Top 2%",
  eventDate = "21 November 2026",
  service = "resend",
}) {
  const cleanName    = participantName.replace(/&amp;/g, "&").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
  const cleanCollege = college.replace(/&amp;/g, "&").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
  const cleanTrack   = track.replace(/&amp;/g, "&").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
  const dateStr      = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const certPdf = await generateStateRoundClearanceCertificate({
    participantName: cleanName,
    registrationId,
    college: cleanCollege,
    track: cleanTrack,
    stateRank,
    score,
    percentile,
    eventDate,
  });

  const text =
`GOVERNMENT OF GUJARAT
Gujarat Student Startup & Innovation Hub (i-Hub)
Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad - 380015

OFFICIAL STATE ROUND CLEARANCE CERTIFICATE
Reference: ${registrationId} / IHUB/STATE-ROUND/CLR/2026/0421
Date of Issue: ${dateStr}

Dear ${cleanName},

We are pleased to officially inform you that you have SUCCESSFULLY CLEARED the State Round of the i-Hub Gujarat Innovation Hackathon 2026.

STATE ROUND RESULT:
  Score         : ${score}
  State Rank    : #${stateRank}
  Merit Percentile: ${percentile}
  Result Status : CLEARED — QUALIFIED FOR NATIONAL ALL-INDIA ROUND

Your official State Round Clearance Certificate is attached to this email as a PDF document. This certificate confirms your qualification into the National (All-India) Round of the i-Hub Gujarat Innovation Hackathon 2026 and your deputation as a State Innovation Fellow.

NEXT STEPS:
1. Review the attached certificate (2 pages) for full details of entitlements.
2. The consolidated All-India National Merit Rank List and Stage 2 VC Pitch schedule will be dispatched to this email address.
3. Ensure your registered email is monitored at all times for further communications.

Attached: i-Hub_State_Round_Clearance_Certificate_${registrationId}.pdf (Official, 2 Pages)

Sincerely,
Director of Innovation & Research
Gujarat Student Startup & Innovation Hub (i-Hub)
Government of Gujarat`;

  const html = `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #111827; max-width: 650px; margin: 0 auto; padding: 20px 0;">
<pre style="font-family: inherit; font-size: inherit; white-space: pre-wrap; margin: 0; line-height: 1.6; color: #111827;">${text}</pre>
</div>`;

  const mailData = {
    to,
    subject: `Official State Round Clearance Certificate [${registrationId}] - i-Hub Gujarat`,
    text,
    html,
    attachments: [
      {
        filename: `i-Hub_State_Round_Clearance_Certificate_${registrationId}.pdf`,
        content: certPdf,
      },
    ],
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
  sendNationalCohortSelectionEmail,
  sendStateRoundCertificateEmail,
  sendHackathonRegistrationEmail: sendHackathonDossierEmail, // alias for backwards compatibility
};
