const nodemailer = require("nodemailer");
const { Resend } = require("resend");

require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Reusable persistent pooled transporter for instant Gmail dispatch without reconnection overhead
let cachedTransporter = null;
function getTransporter() {
  if (!cachedTransporter && process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use direct SSL for fastest initial handshake
      pool: true,   // Keep persistent connection alive for instant dispatch
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });
  }
  return cachedTransporter;
}

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
    const transporter = getTransporter() || nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
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
