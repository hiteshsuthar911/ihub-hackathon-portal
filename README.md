# i-Hub Gujarat Innovation Hackathon 2026 — Official Portal & Email Dispatch Engine

A secured, production-grade event registration, participant screening, and email automation system for **i-Hub (Gujarat Student Startup and Innovation Hub)**, Navrangpura, Ahmedabad.

Built with **Node.js, React Email, Nodemailer/Resend, MongoDB Atlas, and PDFKit**.

---

## 🚀 Complete 5-Stage Participant Lifecycle

1. **Stage 1 (Call for Innovators)**:
   - Official invitation email from `i-Hub Event Cell` sent to prospects with invitation details and a direct link to the registration portal (`/portal`).
2. **Stage 2 (Secured Portal & Cryptographic Email OTP Verification)**:
   - **Solo vs Team Squad**: Supports solo hackers or squad leads with up to 3 teammates.
   - **Meal & Food Selection**: Pure Vegetarian (Gujarati/North Indian), Jain Food (No root veg), Swaminarayan Food, or Standard.
   - **Parental / Guardian Consent**: Captures guardian name and mobile phone for overnight stay approval.
   - **Strict Campus Disqualification Rule**: Mandatory agreement that leaving the i-Hub Navrangpura campus during the 36-hour sprint without permission results in **immediate disqualification**.
   - **HMAC-SHA256 OTP Verification**: 6-digit one-time passcode with sliding window rate limiting.
3. **Stage 3 (Registration Dossier with 4 PDF Attachments)**:
   - Dispatched immediately upon verified registration.
   - Attaches 4 official PDF documents:
     1. `IHUB-Registration-Receipt.pdf`
     2. `IHUB-Food-Coupon-Pass.pdf`
     3. `IHUB-Campus-Security-Undertaking.pdf` (Strict anti-exit clause)
     4. `IHUB-Parental-Guardian-Consent.pdf`
4. **Stage 4 (Shortlist & 2-Step Secured RSVP Gate)**:
   - Shortlisted candidates receive a secured link to `/rsvp?token=...`.
   - **Step 1 (Security Gate)**: Requires inputting unique Registration Number (`IHUB-2026-XXXX`) + registered email.
   - **Step 2 (Attendance & Property Clearance)**: Re-confirms arrival time (Dec 12, 08:30 AM), personal laptop serial number for security desk clearance, and re-pledges the anti-exit policy.
5. **Stage 5 (Final Clearance & Master Hacker Boarding Pass)**:
   - Dispatched immediately upon RSVP confirmation.
   - Contains minute-by-minute 36-hour schedule, assigned booth (`Booth #B-14`), emergency desk contacts, and **attached Master Hacker Boarding Pass PDF**.

---

## 🍃 MongoDB Atlas Connection

The database layer (`db.js`) connects to MongoDB Atlas seamlessly:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ihub_hackathon?retryWrites=true&w=majority`
3. Add it to your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ihub_hackathon?retryWrites=true&w=majority
   ```
4. *Graceful Offline Fallback*: If `MONGODB_URI` is not provided, the application runs on the local persistent storage in `data/registrations.json`.

---

## 📧 Email Sending Configuration (Resend & Gmail SMTP)

In your `.env` file, configure your Resend API key or Gmail SMTP:
```env
# Resend API (Recommended)
RESEND_API_KEY=re_your_api_key
RESEND_FROM=i-Hub Event Cell <onboarding@resend.dev>

# Gmail SMTP (Fallback)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
```

---

## 🌐 Deploy to Render in 1-Click

This repository is pre-configured with `render.yaml`:
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "i-Hub Hackathon 2026 Portal & Email Automation"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Log into [Render](https://render.com) and click **New +** -> **Blueprint**.
3. Select your GitHub repository.
4. Set your environment variables (`MONGODB_URI`, `RESEND_API_KEY`, etc.) in the Render dashboard.
5. Click **Apply** — Render will automatically build and deploy!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start the Mail Studio and Portal
npm run preview
# Portal: http://localhost:3000/portal
# RSVP Gate: http://localhost:3000/rsvp
# Mail Studio: http://localhost:3000
```
