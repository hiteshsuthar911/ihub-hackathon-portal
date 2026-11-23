# 📄 RESEND EMAIL SETUP GUIDE

A simple guide to sending emails from your Node.js backend using **Resend**.

---

## ✅ PREREQUISITES

Before starting, make sure you have:

1. **Node.js installed**

2. **Resend SDK installed**

Install it using:
```bash
npm install resend
```

3. **A Resend account**

Sign up here:

https://resend.com

---

## ☁️ WHY USE RESEND INSTEAD OF SMTP?

Many cloud providers **block SMTP ports** for security reasons.

Common blocked ports:

25
465
587

Because of this, traditional email solutions like **Gmail SMTP with Nodemailer** may fail when deployed on:

* Serverless platforms
* Some cloud hosting providers
* Restricted VPS environments

### How Resend Solves This

Resend **does not use SMTP**.

Instead, it sends emails using a **secure HTTP API request**.

This means your backend simply makes an **HTTP call** to send emails, which works reliably in modern cloud deployments.

---

## 🔑 STEP 1 — CREATE A RESEND API KEY

1. Visit the API keys page:

https://resend.com/api-keys

2. Click **Create API Key**

3. Give it a name such as:

Node Backend

4. Copy the generated API key.

Example:

re_1234567890abcdef

This key will be used in your backend.

---

## 📦 STEP 2 — CREATE `.env` FILE

Inside your project root, create a file named:

.env

Add the following environment variable:

RESEND_API_KEY=your_resend_api_key

Example:

RESEND_API_KEY=re_1234567890abcdef

### ⚠️ Important

Make sure `.env` is listed inside `.gitignore` to avoid leaking credentials.

Example `.gitignore` entry:

.env

---

## 📬 STEP 3 — CREATE `sendMail.js` FILE

Create a file named:

sendMail.js

Add the following code to send emails using Resend:

const { Resend } = require("resend")
require("dotenv").config()

const resend = new Resend(process.env.RESEND_API_KEY)

const sendMail = async (to, subject, text) => {
try {
const response = await resend.emails.send({
from: "[onboarding@resend.dev](mailto:onboarding@resend.dev)",
to: to,
subject: subject,
text: text
})

console.log("Email sent:", response)  

} catch (err) {
console.error("Error sending email:", err)
}
}

module.exports = sendMail

---

## 🚀 STEP 4 — USE THE FUNCTION

You can now use the function anywhere in your backend.

Example usage:

const sendMail = require("./sendMail")

sendMail(
"[recipient@example.com](mailto:recipient@example.com)",
"Test Subject",
"Hello! This is a test email."
)

---

## 🔐 PRODUCTION NOTE

For production applications, you should verify your **custom domain** inside Resend.

Then use a sender email such as:

[noreply@yourdomain.com](mailto:noreply@yourdomain.com)

Instead of the default testing sender:

[onboarding@resend.dev](mailto:onboarding@resend.dev)

Verifying your domain improves:

* Email deliverability
* Trust with email providers
* Production readiness

---

## ✅ SUMMARY

Steps to send emails using Resend:

1. Install the **Resend SDK**
2. Create a **Resend API key**
3. Store it inside `.env`
4. Create a reusable **sendMail function**
5. Call the function whenever your backend needs to send an email

Your backend can now **send emails using HTTP instead of SMTP**, making it more reliable for cloud deployments.
