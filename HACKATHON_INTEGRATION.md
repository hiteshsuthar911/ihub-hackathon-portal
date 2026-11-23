# 🏛️ i-Hub Ahmedabad — Hackathon Mail System Integration Guide

Professional, white/light-themed email notification engine for **i-Hub Gujarat Innovation Hackathon 2026** (Navrangpura, Ahmedabad).

---

## 📍 Hackathon Venue & Details
- **Organizer**: i-Hub (Gujarat Student Startup & Innovation Hub)
- **Venue**: Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015
- **Format**: 36-Hour In-Person Sprint
- **Challenge Tracks**: AI / Generative Agents, Smart Cities, FinTech, AgriTech, DeepTech

---

## 🎨 Professional Light Templates

1. **`apply-hackathon` (Application Announcement)**:
   - Call for innovators to apply before the deadline for the hackathon at i-Hub Navrangpura, Ahmedabad.
2. **`registration` (Registration Confirmed & Participant Pass)**:
   - Official check-in pass, rules, schedule, and automated PDF badge attachment.
3. **`team-invite` (Team Squad Invitation)**:
   - Invite teammates with team roster and 48h expiration link.
4. **`accepted` (Application Accepted & RSVP Confirmation)**:
   - Acceptance announcement with mandatory RSVP confirmation.
5. **`submission` (Project Submission Receipt)**:
   - Confirms project receipt with Devpost/GitHub links and jury presentation slot.
6. **`otp` (Verification Code)**:
   - Crisp 6-digit authentication OTP.

---

## 💻 Backend Usage (`hackathonMailer.js`)

```javascript
const {
  sendHackathonApplicationInviteEmail,
  sendHackathonRegistrationEmail,
  sendHackathonTeamInviteEmail,
  sendHackathonAcceptanceEmail,
  sendHackathonSubmissionEmail,
  sendHackathonOtpEmail,
} = require("./hackathonMailer");

// 1. Send Application Invite:
await sendHackathonApplicationInviteEmail({
  to: "innovator@example.com",
  recipientName: "Alex",
  service: "nodemailer", // or "resend"
});

// 2. Send Registration Confirmation with PDF Badge Attachment:
await sendHackathonRegistrationEmail({
  to: "innovator@example.com",
  participantName: "Alex Rivera",
  registrationId: "IHUB-2026-9842",
  teamName: "NeuralVoyage",
  track: "AI, Generative Agents & Automation",
  attachPass: true,
});
```
