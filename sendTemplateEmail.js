require("dotenv").config();
const {
  sendHackathonApplicationInviteEmail,
  sendHackathonRegistrationEmail,
  sendHackathonTeamInviteEmail,
} = require("./hackathonMailer");

/**
 * Example CLI runner to test dispatching Hackathon emails for i-Hub Ahmedabad.
 */
async function runHackathonEmailDemo() {
  const recipient = process.env.GMAIL_USER;
  if (!recipient) {
    console.warn("⚠️  No GMAIL_USER defined in .env. Set your email in .env to test sending.");
    return;
  }

  console.log(`\n🏛️ Dispatching i-Hub Hackathon Application Invite to: ${recipient}`);
  const result1 = await sendHackathonApplicationInviteEmail({
    to: recipient,
    recipientName: "Innovator",
    service: "nodemailer",
  });

  if (result1.success) {
    console.log("✅ 1. Application invitation email sent!");
  } else {
    console.error("❌ Failed to send application email:", result1.error);
  }

  console.log(`\n⚡ Dispatching i-Hub Registration Confirmation + PDF Pass to: ${recipient}`);
  const result2 = await sendHackathonRegistrationEmail({
    to: recipient,
    participantName: "Alex Rivera",
    registrationId: "IHUB-2026-9842",
    teamName: "NeuralVoyage",
    track: "AI, Generative Agents & Automation",
    attachPass: true,
    service: "nodemailer",
  });

  if (result2.success) {
    console.log("✅ 2. Registration confirmation + PDF Pass sent!");
  } else {
    console.error("❌ Failed to send registration email:", result2.error);
  }
}

if (require.main === module) {
  runHackathonEmailDemo();
}

module.exports = { runHackathonEmailDemo };
