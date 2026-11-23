const { sendMailWithNodemailer, sendMailWithResend } = require("./sendMail");

async function main() {
  const recipient = process.env.GMAIL_USER; // Defaulting to your own email for testing
  
  console.log(`Sending test email to ${recipient}...`);
  await sendMailWithNodemailer(
    recipient,
    "Test Email via Nodemailer (Gmail)",
    "Hello! Your Nodemailer setup is working properly."
  );
}

main();
