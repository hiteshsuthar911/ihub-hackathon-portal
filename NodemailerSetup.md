# 📄 NODEMAILER SETUP GUIDE

A simple guide to sending emails from your Node.js backend using **Nodemailer with Gmail SMTP**.

---

## ✅ PREREQUISITES

Before starting, make sure you have:

1. **Node.js installed**

2. **Nodemailer installed**

Install it using:
```bash
npm install nodemailer
```

3. **A Gmail account** (used to send emails)

---

## 💌 STEP 1 — GENERATE A GMAIL APP PASSWORD

⚠️ Gmail no longer allows applications to access your account using your **regular password**.

You must create an **App Password**.

Follow these steps to generate one.

### 1. Enable 2-Step Verification

Visit:

https://myaccount.google.com/security

Under **Signing in to Google**, enable:

2-Step Verification

---

### 2. Create an App Password

Go to:

https://myaccount.google.com/apppasswords

Then:

1. Select **Mail** as the app
2. Choose **Other (Custom name)**
3. Enter a name such as:

Nodemailer

4. Click **Generate**

---

### 3. Copy the Generated Password

Google will generate a **16-character password**, for example:

abcd efgh ijkl mnop

Store this password securely.

---

### 4. Define Environment Variables

Use:

GMAIL_USER → your Gmail address
GMAIL_PASS → the generated 16-character app password

---

## 📦 STEP 2 — CREATE `.env` FILE

Inside your project root, create a file named:

.env

Add the following variables:

GMAIL_USER=[yourgmail@gmail.com](mailto:yourgmail@gmail.com)
GMAIL_PASS=your16charAppPassword

### ⚠️ Important

Make sure `.env` is listed inside `.gitignore` to avoid pushing credentials to GitHub.

Example `.gitignore` entry:

.env

---

## 📬 STEP 3 — CREATE `sendMail.js`

Create a file named:

sendMail.js

Add the following code to send emails using Nodemailer.

const nodemailer = require("nodemailer")
require("dotenv").config()

const sendMail = async (to, subject, text) => {
try {
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.GMAIL_USER,
pass: process.env.GMAIL_PASS
}
})

const mailOptions = {  
  from: process.env.GMAIL_USER,  
  to: to,  
  subject: subject,  
  text: text  
}  

const result = await transporter.sendMail(mailOptions)  

console.log("Email sent:", result.response)  

} catch (err) {
console.error("Error sending email:", err)
}
}

module.exports = sendMail

---

## 🚀 STEP 4 — USE THE FUNCTION

Now you can use the function anywhere in your backend.

Example:

const sendMail = require("./sendMail")

sendMail(
"[recipient@example.com](mailto:recipient@example.com)",
"Test Subject",
"Hello! This is a test email."
)

---

## 🔐 PRODUCTION NOTE

Gmail SMTP works well for **development and testing**, but it has some limitations in production environments:

* Sending limits
* Deliverability issues
* Potential SMTP restrictions on cloud platforms

For large production systems, consider using **dedicated email services** such as:

* Resend
* SendGrid
* Amazon SES

These services provide better **scalability, reliability, and deliverability**.

---

## ✅ SUMMARY

Steps to send emails using Nodemailer:

1. Install **Nodemailer**
2. Generate a **Gmail App Password**
3. Store credentials inside `.env`
4. Create a reusable **sendMail function**
5. Call the function whenever your backend needs to send an email

Your backend can now send emails using **Gmail SMTP via Nodemailer**.
