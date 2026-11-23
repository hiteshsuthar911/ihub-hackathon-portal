const PDFDocument = require("pdfkit");

/**
 * 1. Generate Registration Receipt PDF
 */
function generateRegistrationReceiptPdf(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const name = data.participantName || "Alex Rivera";
    const regId = data.registrationId || "IHUB-2026-9842";
    const team = data.teamName || "Solo";
    const track = data.track || "AI, Generative Agents & Automation";
    const college = data.college || "Gujarat University";
    const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    // Background
    doc.rect(0, 0, 595.28, 841.89).fill("#f8fafc");

    // Main Card
    doc.roundedRect(36, 40, 523, 760, 10).fillAndStroke("#ffffff", "#cbd5e1");

    // Header Strip
    doc.roundedRect(36, 40, 523, 80, 10).fill("#1e1b4b");
    doc.rect(36, 105, 523, 15).fill("#1e1b4b");
    doc.rect(36, 40, 523, 4).fill("#4f46e5");

    doc.fillColor("#a5b4fc").fontSize(9).font("Helvetica-Bold").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 56, 56);
    doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("HACKATHON REGISTRATION RECEIPT", 56, 72);
    doc.fillColor("#34d399").fontSize(10).font("Helvetica-Bold").text("STATUS: VERIFIED", 380, 74, { align: "right", width: 160 });

    // Details Grid
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("APPLICANT NAME", 56, 140);
    doc.fillColor("#0f172a").fontSize(16).font("Helvetica-Bold").text(name, 56, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("REGISTRATION REF ID", 360, 140);
    doc.fillColor("#4338ca").fontSize(16).font("Courier-Bold").text(regId, 360, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("INSTITUTION / ORG", 56, 195);
    doc.fillColor("#334155").fontSize(12).font("Helvetica").text(college, 56, 210);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("SQUAD / TEAM", 360, 195);
    doc.fillColor("#334155").fontSize(12).font("Helvetica-Bold").text(team, 360, 210);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("CHALLENGE TRACK", 56, 245);
    doc.fillColor("#0284c7").fontSize(12).font("Helvetica-Bold").text(track, 56, 260);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("REGISTRATION DATE", 360, 245);
    doc.fillColor("#334155").fontSize(12).font("Helvetica").text(dateStr, 360, 260);

    // Summary Table
    doc.roundedRect(56, 305, 483, 140, 8).fillAndStroke("#f8fafc", "#e2e8f0");
    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text("REGISTRATION DOSSIER CHECKLIST", 72, 320);

    const items = [
      "✓ Identity & Contact Information: Authenticated via Email OTP",
      "✓ Food & Catering Registration: Meal coupons assigned",
      "✓ Campus Safety & Anti-Exit Undertaking: Formally accepted",
      "✓ Parental / Guardian Authorization: Submitted for overnight stay",
      "✓ Hardware Equipment Gate Pass: Registered for on-campus entry",
    ];

    let y = 345;
    items.forEach((it) => {
      doc.fillColor("#059669").fontSize(9.5).font("Helvetica").text(it, 72, y);
      y += 18;
    });

    // Barcode Strip
    doc.roundedRect(56, 470, 483, 60, 6).fill("#f1f5f9");
    doc.fillColor("#4338ca").fontSize(16).font("Courier-Bold").text(`|||| | | ||| |||| | || ${regId} || | |||| |||`, 56, 488, { align: "center", width: 483, characterSpacing: 2 });
    doc.fillColor("#64748b").fontSize(8).font("Helvetica").text("Official Digital Submission Cryptographic Hash: Verified by i-Hub Admissions Cell", 56, 512, { align: "center", width: 483 });

    // Venue & Reporting
    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text("REPORTING & VENUE INSTRUCTIONS", 56, 560);
    doc.moveTo(56, 575).lineTo(539, 575).strokeColor("#cbd5e1").stroke();

    doc.fillColor("#334155").fontSize(9.5).font("Helvetica").text(
      "Venue: i-Hub Campus, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015\n" +
      "Reporting Time: Friday, December 12, 2026 at 08:30 AM IST sharp.\n" +
      "Please carry a physical government ID (Aadhaar / Voter ID / College ID) and this printed or digital dossier receipt for desk check-in.",
      56,
      585,
      { width: 483, lineGap: 4 }
    );

    // Footer
    doc.fillColor("#94a3b8").fontSize(8).font("Helvetica").text(
      `Document Reference: ${regId}-RECEIPT • Issued by i-Hub Admissions Cell, Navrangpura, Ahmedabad`,
      56,
      765,
      { align: "center", width: 483 }
    );

    doc.end();
  });
}

/**
 * 2. Generate Food & Catering Meal Pass PDF
 */
function generateFoodPassPdf(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const name = data.participantName || "Alex Rivera";
    const regId = data.registrationId || "IHUB-2026-9842";
    const diet = data.foodPreference || "Pure Vegetarian";

    doc.rect(0, 0, 595.28, 841.89).fill("#f8fafc");
    doc.roundedRect(36, 40, 523, 760, 10).fillAndStroke("#ffffff", "#cbd5e1");

    // Header
    doc.roundedRect(36, 40, 523, 80, 10).fill("#064e3b");
    doc.rect(36, 105, 523, 15).fill("#064e3b");
    doc.rect(36, 40, 523, 4).fill("#10b981");

    doc.fillColor("#a7f3d0").fontSize(9).font("Helvetica-Bold").text("HOSPITALITY CELL // i-HUB AHMEDABAD", 56, 56);
    doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("36-HOUR FOOD & MEAL COUPON PASS", 56, 72);
    doc.fillColor("#34d399").fontSize(10).font("Helvetica-Bold").text("ALL-INCLUSIVE PASS", 380, 74, { align: "right", width: 160 });

    // Bio
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("PARTICIPANT NAME", 56, 140);
    doc.fillColor("#0f172a").fontSize(15).font("Helvetica-Bold").text(name, 56, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("PASS ID", 360, 140);
    doc.fillColor("#059669").fontSize(15).font("Courier-Bold").text(regId, 360, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("REGISTERED DIET PREFERENCE", 56, 190);
    doc.fillColor("#065f46").fontSize(14).font("Helvetica-Bold").text(`🍽️ ${diet.toUpperCase()}`, 56, 205);

    doc.roundedRect(56, 235, 483, 40, 6).fill("#ecfdf5");
    doc.fillColor("#065f46").fontSize(9.5).font("Helvetica").text(
      "Note: Meals are freshly prepared on-campus. Dedicated Jain & Swaminarayan counters are segregated.",
      70,
      248
    );

    // Meal Slots Table
    doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text("SCHEDULED ON-CAMPUS MEALS & COUPONS", 56, 295);
    doc.moveTo(56, 310).lineTo(539, 310).strokeColor("#cbd5e1").stroke();

    const meals = [
      { day: "Day 1 (Friday)", time: "08:30 AM", slot: "Welcome Breakfast & Tea", code: "DAY1-B1" },
      { day: "Day 1 (Friday)", time: "01:00 PM", slot: "Grand Buffet Lunch", code: "DAY1-L1" },
      { day: "Day 1 (Friday)", time: "05:00 PM", slot: "High Tea & Gujarati Snacks", code: "DAY1-T1" },
      { day: "Day 1 (Friday)", time: "08:30 PM", slot: "Dinner Buffet", code: "DAY1-D1" },
      { day: "Day 1 (Friday)", time: "11:30 PM", slot: "Midnight Coffee & Energy Boost", code: "DAY1-M1" },
      { day: "Day 2 (Saturday)", time: "08:00 AM", slot: "Power Breakfast", code: "DAY2-B2" },
      { day: "Day 2 (Saturday)", time: "01:00 PM", slot: "Executive Lunch", code: "DAY2-L2" },
      { day: "Day 2 (Saturday)", time: "05:00 PM", slot: "Evening Tea & Refreshments", code: "DAY2-T2" },
      { day: "Day 2 (Saturday)", time: "08:30 PM", slot: "Gala Dinner Buffet", code: "DAY2-D2" },
      { day: "Day 2 (Saturday)", time: "12:00 AM", slot: "Midnight Pizza & Red Bull", code: "DAY2-M2" },
      { day: "Day 3 (Sunday)", time: "08:00 AM", slot: "Finale Breakfast", code: "DAY3-B3" },
      { day: "Day 3 (Sunday)", time: "01:30 PM", slot: "Celebration Lunch Buffet", code: "DAY3-L3" },
    ];

    let rowY = 325;
    meals.forEach((m) => {
      doc.fillColor("#64748b").fontSize(9).font("Helvetica").text(m.day, 60, rowY);
      doc.fillColor("#0f172a").fontSize(9).font("Helvetica-Bold").text(m.time, 175, rowY);
      doc.fillColor("#334155").fontSize(9).font("Helvetica").text(m.slot, 250, rowY);
      doc.fillColor("#059669").fontSize(9).font("Courier-Bold").text(m.code, 470, rowY);
      doc.moveTo(56, rowY + 16).lineTo(539, rowY + 16).strokeColor("#f1f5f9").stroke();
      rowY += 24;
    });

    // Barcode Strip
    doc.roundedRect(56, 660, 483, 70, 6).fill("#f1f5f9");
    doc.fillColor("#065f46").fontSize(16).font("Courier-Bold").text(`||| | || ${regId} | FOOD-${diet.slice(0, 3).toUpperCase()} |||`, 56, 678, { align: "center", width: 483, characterSpacing: 2 });
    doc.fillColor("#64748b").fontSize(8).font("Helvetica").text("Show this digital coupon or your physical badge at the i-Hub Cafeteria scanner.", 56, 705, { align: "center", width: 483 });

    doc.end();
  });
}

/**
 * 3. Generate Campus Security & Anti-Exit Undertaking PDF
 */
function generateSecurityUndertakingPdf(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const name = data.participantName || "Alex Rivera";
    const regId = data.registrationId || "IHUB-2026-9842";
    const team = data.teamName || "Solo";

    doc.rect(0, 0, 595.28, 841.89).fill("#f8fafc");
    doc.roundedRect(36, 40, 523, 760, 10).fillAndStroke("#ffffff", "#cbd5e1");

    // Header
    doc.roundedRect(36, 40, 523, 80, 10).fill("#881337");
    doc.rect(36, 105, 523, 15).fill("#881337");
    doc.rect(36, 40, 523, 4).fill("#f43f5e");

    doc.fillColor("#fecdd3").fontSize(9).font("Helvetica-Bold").text("CHIEF SECURITY CELL // i-HUB CAMPUS PROTOCOL", 56, 56);
    doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("SECURITY UNDERTAKING & ZERO-TOLERANCE POLICY", 56, 72);
    doc.fillColor("#fecdd3").fontSize(9).font("Helvetica-Bold").text("MANDATORY CLEARANCE", 380, 74, { align: "right", width: 160 });

    // Candidate Details
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("CANDIDATE NAME", 56, 140);
    doc.fillColor("#0f172a").fontSize(15).font("Helvetica-Bold").text(name, 56, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("PASS ID", 360, 140);
    doc.fillColor("#be123c").fontSize(15).font("Courier-Bold").text(regId, 360, 155);

    // CRITICAL NOTICE BOX
    doc.roundedRect(56, 195, 483, 115, 8).fillAndStroke("#fff1f2", "#f43f5e");
    doc.fillColor("#9f1239").fontSize(11).font("Helvetica-Bold").text("⚠️ STRICT CAMPUS BOUNDARY & ANTI-EXIT RULE (NON-NEGOTIABLE)", 72, 210);
    doc.fillColor("#881337").fontSize(9.5).font("Helvetica-Bold").text(
      "If any participant steps outside the i-Hub campus gates during the 36-hour sprint without prior written authorization and escort from the Chief Security Officer, the participant and their entire team will be IMMEDIATELY DISQUALIFIED from the hackathon.\n\n" +
      "NO SECOND CHANCES, APPEALS, OR RE-ENTRY WILL BE GRANTED UNDER ANY CIRCUMSTANCES. This policy is strictly enforced to ensure participant safety and competition integrity.",
      72,
      230,
      { width: 450, lineGap: 3 }
    );

    // Protocols
    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text("SECURITY DIRECTIVES & OPERATING CODES", 56, 335);
    doc.moveTo(56, 350).lineTo(539, 350).strokeColor("#cbd5e1").stroke();

    const directives = [
      "1. Mandatory ID Badge: Your physical RFID/NFC hacker badge must be worn around your neck at all times inside campus.",
      "2. Overnight Security Perimeter: All main gates are sealed between 10:00 PM and 06:00 AM. 24x7 security personnel patrol the premise.",
      "3. Equipment Clearance: Any laptops, development boards, and hardware must match the serials logged at the check-in security desk.",
      "4. Emergency Protocol: In case of medical necessity, alert your floor marshal immediately. Paramedics and an ambulance are stationed 24/7 on premise.",
      "5. Zero Substance Tolerance: Consumption or possession of alcohol, cigarettes, or restricted substances is strictly prohibited on government premises and results in police referral.",
    ];

    let yPos = 365;
    directives.forEach((d) => {
      doc.fillColor("#334155").fontSize(9.5).font("Helvetica").text(d, 56, yPos, { width: 483, lineGap: 3 });
      yPos += 36;
    });

    // Formal Undertaking
    doc.roundedRect(56, 570, 483, 90, 6).fill("#f8fafc");
    doc.fillColor("#0f172a").fontSize(10).font("Helvetica-Bold").text("FORMAL CANDIDATE UNDERTAKING", 70, 582);
    doc.fillColor("#475569").fontSize(8.5).font("Helvetica").text(
      `I, ${name} (Registration ID: ${regId}, Team: ${team}), hereby acknowledge that I have read, understood, and agreed to adhere to all i-Hub Campus Security directives. I expressly accept that leaving campus boundaries without permission will result in immediate disqualification without appeal.`,
      70,
      600,
      { width: 455, lineGap: 3 }
    );

    doc.fillColor("#059669").fontSize(9).font("Helvetica-Bold").text("DIGITALLY SIGNED & VERIFIED AT REGISTRATION", 70, 642);

    doc.end();
  });
}

/**
 * 4. Generate Parental & Guardian Approval Form PDF
 */
function generateParentalConsentPdf(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const name = data.participantName || "Alex Rivera";
    const regId = data.registrationId || "IHUB-2026-9842";
    const parentName = data.parentalApproval?.parentName || "Parent / Guardian";
    const parentPhone = data.parentalApproval?.parentPhone || "+91 98765 00000";
    const relationship = data.parentalApproval?.relationship || "Parent";

    doc.rect(0, 0, 595.28, 841.89).fill("#f8fafc");
    doc.roundedRect(36, 40, 523, 760, 10).fillAndStroke("#ffffff", "#cbd5e1");

    // Header
    doc.roundedRect(36, 40, 523, 80, 10).fill("#1e3a8a");
    doc.rect(36, 105, 523, 15).fill("#1e3a8a");
    doc.rect(36, 40, 523, 4).fill("#3b82f6");

    doc.fillColor("#bfdbfe").fontSize(9).font("Helvetica-Bold").text("STUDENT WELFARE CELL // i-HUB AHMEDABAD", 56, 56);
    doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("PARENT / GUARDIAN APPROVAL & CONSENT FORM", 56, 72);
    doc.fillColor("#93c5fd").fontSize(9).font("Helvetica-Bold").text("OVERNIGHT STAY CONSENT", 380, 74, { align: "right", width: 160 });

    // Details Grid
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("STUDENT / CANDIDATE NAME", 56, 140);
    doc.fillColor("#0f172a").fontSize(15).font("Helvetica-Bold").text(name, 56, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("REGISTRATION ID", 360, 140);
    doc.fillColor("#1e40af").fontSize(15).font("Courier-Bold").text(regId, 360, 155);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("PARENT / GUARDIAN NAME", 56, 195);
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text(parentName, 56, 210);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("RELATIONSHIP & CONTACT", 360, 195);
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica").text(`${relationship} • ${parentPhone}`, 360, 210);

    // Consent Clauses
    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text("DECLARATION & TERMS OF CONSENT", 56, 260);
    doc.moveTo(56, 275).lineTo(539, 275).strokeColor("#cbd5e1").stroke();

    const clauses = [
      "1. Overnight Campus Stay: I grant full permission for my child/ward to stay on-campus overnight at i-Hub Ahmedabad, Navrangpura from Dec 12 to Dec 14, 2026 for the 36-hour hackathon.",
      "2. Security & Compliance: I acknowledge that my child/ward must remain inside the i-Hub campus perimeter at all times and adhere to all security guidelines.",
      "3. Medical Assistance Consent: In the event of illness, exhaustion, or injury, I authorize the i-Hub medical staff to administer first aid or transfer to the nearest partner hospital.",
      "4. Emergency Availability: I confirm that the contact number provided above will remain active and reachable throughout the hackathon weekend.",
    ];

    let yC = 295;
    clauses.forEach((c) => {
      doc.fillColor("#334155").fontSize(9.5).font("Helvetica").text(c, 56, yC, { width: 483, lineGap: 3 });
      yC += 34;
    });

    // Parent Sign Box
    doc.roundedRect(56, 460, 483, 110, 8).fillAndStroke("#f8fafc", "#cbd5e1");
    doc.fillColor("#0f172a").fontSize(10).font("Helvetica-Bold").text("PARENT / GUARDIAN VERIFICATION", 72, 475);
    doc.fillColor("#475569").fontSize(9).font("Helvetica").text(
      `"I hereby confirm that I have authorized ${name} to participate in the i-Hub Innovation Hackathon 2026 and take full responsibility for their attendance and compliance."`,
      72,
      495,
      { width: 450, fontStyle: "italic" }
    );

    doc.fillColor("#059669").fontSize(9.5).font("Helvetica-Bold").text("STATUS: DIGITALLY VERIFIED VIA REGISTRATION PORTAL", 72, 540);

    // Emergency Helpline
    doc.roundedRect(56, 600, 483, 60, 6).fill("#eff6ff");
    doc.fillColor("#1e40af").fontSize(9).font("Helvetica-Bold").text("i-HUB 24/7 PARENT HELPDESK & EMERGENCY ROOM", 72, 612);
    doc.fillColor("#1e3a8a").fontSize(9).font("Helvetica").text("Phone: +91 79 2630 0000 / +91 98765 00000  |  Email: emergency@ihubgujarat.in", 72, 628);
    doc.fillColor("#64748b").fontSize(8).font("Helvetica").text("Campus Address: Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad 380015", 72, 644);

    doc.end();
  });
}

/**
 * 5. Generate Master Official Hacker Boarding Pass PDF
 */
function generateOfficialHackerPassPdf(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const name = data.participantName || "Alex Rivera";
    const regId = data.registrationId || "IHUB-2026-9842";
    const team = data.teamName || "Solo";
    const track = data.track || "AI, Generative Agents & Automation";
    const booth = data.boothNumber || "Booth #A-14";
    const dates = "December 12 - 14, 2026 (36 Hours Non-Stop)";
    const venue = "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015";

    doc.rect(0, 0, 595.28, 841.89).fill("#f1f5f9");
    doc.roundedRect(36, 36, 523, 768, 12).fillAndStroke("#ffffff", "#cbd5e1");

    // Master Header
    doc.roundedRect(36, 36, 523, 90, 12).fill("#1e1b4b");
    doc.rect(36, 110, 523, 16).fill("#1e1b4b");
    doc.rect(36, 36, 523, 5).fill("#4f46e5");

    doc.fillColor("#a5b4fc").fontSize(9).font("Helvetica-Bold").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 56, 52);
    doc.fillColor("#ffffff").fontSize(22).font("Helvetica-Bold").text("OFFICIAL HACKER BOARDING PASS", 56, 68);
    doc.fillColor("#34d399").fontSize(11).font("Helvetica-Bold").text("✓ ACCESS GRANTED", 360, 72, { align: "right", width: 180 });

    // Row 1: Participant & Pass ID
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("HACKER NAME", 56, 145);
    doc.fillColor("#0f172a").fontSize(20).font("Helvetica-Bold").text(name, 56, 160);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("BOARDING PASS ID", 360, 145);
    doc.fillColor("#4338ca").fontSize(18).font("Courier-Bold").text(regId, 360, 160);

    // Row 2: Team & Station
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("ASSIGNED SQUAD", 56, 210);
    doc.fillColor("#334155").fontSize(14).font("Helvetica-Bold").text(team, 56, 225);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("ALLOCATED HACKING BOOTH", 360, 210);
    doc.fillColor("#059669").fontSize(14).font("Helvetica-Bold").text(booth, 360, 225);

    // Row 3: Track & Reporting
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("CHALLENGE TRACK", 56, 265);
    doc.fillColor("#0284c7").fontSize(13).font("Helvetica-Bold").text(track, 56, 280);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("CAMPUS CHECK-IN TIME", 360, 265);
    doc.fillColor("#be123c").fontSize(13).font("Helvetica-Bold").text("Friday Dec 12, 08:30 AM IST", 360, 280);

    // Encrypted Barcode Strip
    doc.roundedRect(56, 325, 483, 75, 8).fillAndStroke("#f8fafc", "#e2e8f0");
    doc.fillColor("#64748b").fontSize(8).font("Courier-Bold").text("SECURITY DESK SCANNER TOKEN", 72, 338);
    doc.fillColor("#4338ca").fontSize(18).font("Courier-Bold").text(`|| | |||| | ||| | || ${regId} || | |||| |||`, 72, 355, { characterSpacing: 2 });
    doc.fillColor("#64748b").fontSize(8).font("Helvetica").text("Show this digital badge at the gate for fast-track biometric badge printing and hardware tagging.", 72, 382);

    // Venue Box
    doc.roundedRect(56, 420, 483, 50, 6).fill("#eff6ff");
    doc.fillColor("#1e40af").fontSize(9).font("Helvetica-Bold").text("VENUE LOCATION", 70, 430);
    doc.fillColor("#1e3a8a").fontSize(9.5).font("Helvetica").text(venue, 70, 444, { width: 450 });

    // Schedule Matrix
    doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text("36-HOUR MINUTE-BY-MINUTE SCHEDULE MATRIX", 56, 490);
    doc.moveTo(56, 505).lineTo(539, 505).strokeColor("#cbd5e1").stroke();

    const timeline = [
      { t: "Day 1 • 08:30 AM", e: "Security Verification, Swag Kit & Badge Printing" },
      { t: "Day 1 • 10:00 AM", e: "Opening Keynote, Problem Statements & Hacking Begins" },
      { t: "Day 1 • 08:30 PM", e: "Dinner & Mentor Checkpoint #1 (Architecture Review)" },
      { t: "Day 2 • 02:00 PM", e: "Checkpoint #2: Working Prototype & API Validation" },
      { t: "Day 2 • 12:00 AM", e: "Midnight Coding Marathon & Sponsor Bounties" },
      { t: "Day 3 • 11:00 AM", e: "Code Freeze & Devpost Project Submission Deadline" },
      { t: "Day 3 • 02:30 PM", e: "Grand Finale: Top 10 Live Demos, Jury & Awards" },
    ];

    let tY = 515;
    timeline.forEach((item) => {
      doc.fillColor("#4f46e5").fontSize(8.5).font("Courier-Bold").text(item.t, 60, tY);
      doc.fillColor("#334155").fontSize(8.5).font("Helvetica").text(item.e, 180, tY);
      tY += 18;
    });

    // Zero-Tolerance Notice
    doc.roundedRect(56, 665, 483, 50, 6).fill("#fff1f2");
    doc.fillColor("#be123c").fontSize(8.5).font("Helvetica-Bold").text("CAMPUS SECURITY BOUNDARY WARNING", 70, 674);
    doc.fillColor("#881337").fontSize(8).font("Helvetica").text(
      "Leaving i-Hub premises without authorized security escort during the 36-hour sprint results in IMMEDIATE PERMANENT DISQUALIFICATION. No second chances are granted.",
      70,
      688,
      { width: 450 }
    );

    // Footer
    doc.fillColor("#94a3b8").fontSize(7.5).font("Helvetica").text(
      `Authorized by i-Hub Admissions Board • Prajna Puram, Navrangpura, Ahmedabad 380015 • Pass Ref: ${regId}`,
      56,
      775,
      { align: "center", width: 483 }
    );

    doc.end();
  });
}

module.exports = {
  generateRegistrationReceiptPdf,
  generateFoodPassPdf,
  generateSecurityUndertakingPdf,
  generateParentalConsentPdf,
  generateOfficialHackerPassPdf,
  generateHackathonPass: generateOfficialHackerPassPdf, // backwards compatibility
};
