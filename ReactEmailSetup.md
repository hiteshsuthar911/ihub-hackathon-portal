# 🎨 React Email Templates Guide

This project includes **React Email** component-based templates that render into responsive, cross-client HTML and plain-text fallbacks for both **Gmail SMTP (Nodemailer)** and **Resend**.

---

## 📂 Included Templates

| Template | File | Description |
|---|---|---|
| **Welcome Email** | [`emails/WelcomeEmail.jsx`](file:///Users/hiteshsuthar/Documents/Code/Mail-Sending-Demo-main/emails/WelcomeEmail.jsx) | Brand header, personalized greeting, feature highlights, and CTA button. |
| **OTP / Verification** | [`emails/VerificationEmail.jsx`](file:///Users/hiteshsuthar/Documents/Code/Mail-Sending-Demo-main/emails/VerificationEmail.jsx) | Security badge, monospace 6-digit code box, 10-minute expiry warning. |
| **Invoice / Receipt** | [`emails/InvoiceEmail.jsx`](file:///Users/hiteshsuthar/Documents/Code/Mail-Sending-Demo-main/emails/InvoiceEmail.jsx) | Transaction receipt, order number, line items table, and total amount. |

---

## 🖥️ Interactive Web Preview Studio

To preview your templates in real time and send live test emails right from your browser:

```bash
npm run preview
```

Open **`http://localhost:3000`** in your browser:
* **Switch Templates**: Instantly preview Welcome, Verification, and Invoice designs.
* **Device Toggle**: Switch between **Desktop (600px)** and **Mobile (375px)** responsive views.
* **Live Props Editing**: Change recipient name or OTP code and see the preview update live.
* **1-Click Send**: Choose Gmail SMTP or Resend and send the email directly to your inbox.

---

## 🚀 How to Send in Your Code

### 1. Welcome Email
```javascript
const { sendMailWithNodemailer } = require("./sendMail");
const { WelcomeEmail, renderEmail } = require("./emails");

async function sendWelcome() {
  const { html, text } = await renderEmail(WelcomeEmail, {
    name: "Hitesh",
    companyName: "MailDemo Inc.",
    actionUrl: "https://yourdomain.com",
  });

  await sendMailWithNodemailer({
    to: "recipient@example.com",
    subject: "✨ Welcome to MailDemo!",
    text,
    html,
  });
}
```

### 2. OTP Verification Email
```javascript
const { sendMailWithNodemailer } = require("./sendMail");
const { VerificationEmail, renderEmail } = require("./emails");

async function sendOTP() {
  const code = "839 201";
  const { html, text } = await renderEmail(VerificationEmail, {
    name: "Hitesh",
    code,
    expiresInMinutes: 10,
  });

  await sendMailWithNodemailer({
    to: "recipient@example.com",
    subject: `🔐 Your Verification Code: ${code}`,
    text,
    html,
  });
}
```

### 3. Invoice / Receipt Email
```javascript
const { sendMailWithResend } = require("./sendMail");
const { InvoiceEmail, renderEmail } = require("./emails");

async function sendReceipt() {
  const { html, text } = await renderEmail(InvoiceEmail, {
    customerName: "Hitesh Suthar",
    invoiceNumber: "INV-2026-089",
    items: [
      { desc: "Pro Plan (Monthly)", amount: "$29.00" },
      { desc: "Priority Support", amount: "$10.00" },
    ],
    total: "$39.00",
  });

  await sendMailWithResend({
    to: "recipient@example.com",
    subject: "🧾 Receipt for Invoice #INV-2026-089",
    text,
    html,
  });
}
```

---

## 🧪 CLI Test Commands

* **Preview Studio**: `npm run preview`
* **Send Welcome Template**: `npm run send:template`
* **Basic Text Test**: `npm test`
