const nodemailer = require("nodemailer");
const { Resend } = require("resend");

require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Normalizes arguments so functions can be called either as:
 * sendMail(to, subject, text, html) OR sendMail({ to, subject, text, html })
 */
const parseMailArgs = (toOrOptions, subject, text, html) => {
  if (typeof toOrOptions === "object" && toOrOptions !== null) {
    return toOrOptions;
  }
  return { to: toOrOptions, subject, text, html };
};

const sendMailWithNodemailer = async (toOrOptions, subject, text, html) => {
  const options = parseMailArgs(toOrOptions, subject, text, html);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      connectionTimeout: 8000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    if (options.attachments && options.attachments.length > 0) {
      mailOptions.attachments = options.attachments;
    }

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent via Nodemailer:", result.response);
    return { success: true, response: result.response };
  } catch (err) {
    console.error("Error sending email via Nodemailer:", err.message || err);
    return { success: false, error: err };
  }
};

const sendMailWithResend = async (toOrOptions, subject, text, html) => {
  const options = parseMailArgs(toOrOptions, subject, text, html);
  try {
    const payload = {
      from: process.env.RESEND_FROM || "i-Hub Event Cell <onboarding@resend.dev>",
      to: options.to,
      subject: options.subject,
      text: options.text,
    };
    if (options.html) {
      payload.html = options.html;
    }
    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments;
    }

    const response = await resend.emails.send(payload);
    if (response.error) {
      console.error("[Resend Error]:", response.error.message || response.error);
      return { success: false, error: response.error };
    }
    console.log("Email sent via Resend:", response);
    return { success: true, response };
  } catch (err) {
    console.error("Error sending email via Resend:", err);
    return { success: false, error: err };
  }
};

module.exports = {
  sendMailWithNodemailer,
  sendMailWithResend,
};
