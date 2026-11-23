// Re-export hackathon mailer for compatibility
const hackathonMailer = require("./hackathonMailer");

module.exports = {
  ...hackathonMailer,
  sendIdentityVerificationEmail: hackathonMailer.sendHackathonOtpEmail,
  sendOtpEmail: hackathonMailer.sendHackathonOtpEmail,
};
