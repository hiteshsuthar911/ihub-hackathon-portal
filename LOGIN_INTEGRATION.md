# MTS Decor — Software Login Email Integration Guide

Connect your software login / authentication system with the MTS Decor luxury editorial email templates.

---

## 1. Templates Overview

Based on your reference designs, two luxury editorial templates are available:

### Template 1: "Verify your identity" (`verify-identity`)
- **Use Case**: Initial user registration, critical action approval, or OTP authentication.
- **Design Elements**:
  - Serif headline: `Verify your identity`
  - Pill badge: `SECURITY // VERIFICATION`
  - Warm Sand Passcode Box: Terracotta code (e.g. `891 037`) with countdown timer
  - Security warning disclaimer
  - Luxury architectural footer: **MTS DECOR FIT-OUT & ARCHITECTURE**

### Template 2: "Second-factor login trace" (`2fa-trace`)
- **Use Case**: 2FA step-up authentication, new device / administrative login alert.
- **Design Elements**:
  - Serif headline with accent underline: `Second-factor login trace`
  - Pill badge: `SECURITY // 2FA`
  - Solid Obsidian Black Code Box: Crisp white monospace code (e.g. `442-911`)
  - Request Context Telemetry: IP Address, Operating System, and Date / Time
  - Credential revocation link

---

## 2. Integration Methods

### Method A: Direct Node.js Call (`authMailer.js`)

```javascript
const {
  sendIdentityVerificationEmail,
  sendSecondFactorTraceEmail,
} = require("./authMailer");

// 1. Send "Verify your identity" Passcode:
await sendIdentityVerificationEmail({
  to: "client@example.com",
  name: "Client Name",
  code: "891 037",
  expiresInMinutes: 10,
  service: "nodemailer", // or "resend"
});

// 2. Send "Second-factor login trace" (with telemetry context):
await sendSecondFactorTraceEmail({
  to: "client@example.com",
  name: "Client Name",
  code: "442-911",
  ipAddress: req.ip || "94.200.18.102 (Dubai, UAE)",
  operatingSystem: req.headers["user-agent"] || "MacOS 14.4 (Safari Desktop)",
  dateTime: new Date().toUTCString(),
  revokeUrl: "https://yourdomain.com/security/revoke",
  service: "nodemailer",
});
```

---

### Method B: REST API Endpoints (Language-Agnostic)

When running `node previewServer.js` on port `3000`, the following endpoints are available:

#### 1. POST `/api/auth/send-identity-verify`
```bash
curl -X POST http://localhost:3000/api/auth/send-identity-verify \
  -H "Content-Type: application/json" \
  -d '{
    "to": "client@example.com",
    "name": "Valued User",
    "code": "891 037",
    "expiresInMinutes": 10
  }'
```

#### 2. POST `/api/auth/send-2fa-trace`
```bash
curl -X POST http://localhost:3000/api/auth/send-2fa-trace \
  -H "Content-Type: application/json" \
  -d '{
    "to": "client@example.com",
    "name": "Valued User",
    "code": "442-911",
    "ipAddress": "94.200.18.102 (Dubai, UAE)",
    "operatingSystem": "MacOS 14.4 (Safari Desktop)",
    "dateTime": "March 20, 2026 at 14:32 GST",
    "revokeUrl": "https://mtsdecor.com/security/revoke"
  }'
```

---

## 3. Live Studio Testing

1. Open **`http://localhost:3000`** in your browser.
2. Under **Templates** in the sidebar:
   - Click **📋 Verify your identity**
   - Click **🛡️ Second-factor login trace**
3. Switch between **🖥 Desktop** and **📱 Mobile** viewports to verify responsiveness.
4. Customize the passcode, IP address, OS, or timestamp live and click **📤 Send Test Email** to test actual inbox delivery!
