const PDFDocument = require("pdfkit");
const bwipjs = require("bwip-js");
const QRCode = require("qrcode");

/**
 * Generate a crisp Code-128 Barcode PNG buffer
 */
async function createBarcodeBuffer(text) {
  try {
    return await bwipjs.toBuffer({
      bcid: "code128",
      text: text,
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: "center",
      textsize: 8,
    });
  } catch (err) {
    console.error("Barcode generation error:", err);
    return null;
  }
}

/**
 * Generate a high-resolution QR Code PNG buffer
 */
async function createQrCodeBuffer(text) {
  try {
    return await QRCode.toBuffer(text, {
      width: 140,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch (err) {
    console.error("QR Code generation error:", err);
    return null;
  }
}

/**
 * Sanitize and clean HTML entities and non-ascii artifacts
 */
function cleanText(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "") // remove emoji & corrupted bytes
    .trim();
}

/**
 * Normal, simple, formal page frame with single black border and simple running header/footer
 */
function drawSimplePageFrame(doc, pageNum, totalPages, regId, docCode, title) {
  // Simple clean black border
  doc.lineWidth(0.75).strokeColor("#000000").rect(35, 35, 525, 772).stroke();

  // Running header for Page 2 onwards
  if (pageNum > 1) {
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 45);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`${title} | REF: ${regId}`, 45, 55);
    doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(`DOC: ${docCode}`, 380, 45, { align: "right", width: 170 });
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`Page ${pageNum} of ${totalPages}`, 380, 55, { align: "right", width: 170 });
    doc.moveTo(45, 66).lineTo(550, 66).lineWidth(0.5).strokeColor("#000000").stroke();
  }

  // Simple clean running footer
  const footY = 792;
  doc.moveTo(45, footY - 4).lineTo(550, footY - 4).lineWidth(0.5).strokeColor("#000000").stroke();
  doc.font("Helvetica").fontSize(7).fillColor("#000000").text(
    `Gujarat Student Startup & Innovation Hub (i-Hub) | Prajna Puram, Navrangpura, Ahmedabad 380015 | Helpline: +91 79 2630 1234`,
    45,
    footY
  );
  doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000").text(`Page ${pageNum} of ${totalPages}`, 450, footY, { align: "right", width: 100 });
}

/**
 * ============================================================================
 * 1. REGISTRATION RECEIPT & ADMISSION DOCKET (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateRegistrationReceiptPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-2026-6953");
  const team = cleanText(data.teamName || "Solo Innovator");
  const track = cleanText(data.track || "FinTech & Next-Gen Digital Payments");
  const college = cleanText(data.college || "Thakur College of Engineering and Technology");
  const diet = cleanText(data.foodPreference || "Pure Vegetarian");
  const parentName = cleanText(data.parentName || (data.parentalApproval && data.parentalApproval.parentName) || "Jagdish Suthar");
  const parentPhone = cleanText(data.parentPhone || (data.parentalApproval && data.parentalApproval.parentPhone) || "9768440000");
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(regId),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?doc=receipt`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-ADM-01", "REGISTRATION RECEIPT & ADMISSION DOCKET");

    // Plain Institutional Letterhead
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("EDUCATION DEPARTMENT - GUJARAT STUDENT STARTUP & INNOVATION HUB (i-HUB)", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("KCG Campus, Opp. PRL, Prajna Puram, Navrangpura, Ahmedabad, Gujarat 380015", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Memo Meta Details
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(`REF NO: IHUB/HACK-2026/REG/${regId}`, 45, 98);
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text(`DATE OF ISSUE: ${dateStr.toUpperCase()}`, 350, 98, { align: "right", width: 195 });

    // Document Title (Pure Text, Underlined)
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#000000").text("OFFICIAL HACKATHON REGISTRATION RECEIPT & ADMISSION DOCKET", 45, 116, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#000000").text("EVENT: i-HUB GUJARAT INNOVATION HACKATHON 2026", 45, 131, { align: "center", width: 505 });
    doc.moveTo(100, 142).lineTo(495, 142).lineWidth(0.5).strokeColor("#000000").stroke();

    // Status Line
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("ADMISSION STATUS: PROVISIONALLY VERIFIED & CONFIRMED", 45, 150);
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("VERIFICATION: DUAL-OTP AUTHENTICATED", 350, 150, { align: "right", width: 195 });

    // Section 1: Candidate Table (Simple Black Lines, No Backgrounds)
    const tTop = 168;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: CANDIDATE ADMISSION RECORD", 45, tTop);
    doc.moveTo(45, tTop + 11).lineTo(550, tTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const gY = tTop + 16;
    const rH = 22;
    doc.rect(45, gY, 505, rH * 6).lineWidth(0.5).strokeColor("#000000").stroke();
    for (let i = 1; i < 6; i++) {
      doc.moveTo(45, gY + i * rH).lineTo(550, gY + i * rH).lineWidth(0.5).strokeColor("#000000").stroke();
    }
    doc.moveTo(270, gY).lineTo(270, gY + rH * 6).lineWidth(0.5).strokeColor("#000000").stroke();

    const rows = [
      { l1: "APPLICANT NAME:", v1: name.toUpperCase(), l2: "REGISTRATION ID:", v2: regId, f2: "Courier-Bold" },
      { l1: "COLLEGE / INSTITUTION:", v1: college, l2: "PARTICIPATION FORMAT:", v2: team },
      { l1: "CHALLENGE DOMAIN:", v1: track, l2: "ASSIGNED BOOTH:", v2: "Booth #A-14 (Cluster 2)" },
      { l1: "CATERING PREFERENCE:", v1: diet, l2: "FEES / TUITION:", v2: "Exempt (100% Sponsored)" },
      { l1: "PARENT / GUARDIAN:", v1: parentName, l2: "EMERGENCY PHONE:", v2: parentPhone },
      { l1: "REPORTING VENUE:", v1: "i-Hub Campus Auditorium", l2: "TIMINGS:", v2: "Dec 15, 09:00 AM - Dec 16, 12:30 PM" },
    ];

    rows.forEach((r, idx) => {
      const cy = gY + idx * rH;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l1, 50, cy + 6);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(r.v1, 150, cy + 6, { width: 115, ellipsis: true });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l2, 275, cy + 6);
      doc.font(r.f2 || "Helvetica").fontSize(7.5).fillColor("#000000").text(r.v2, 385, cy + 6, { width: 160, ellipsis: true });
    });

    // Barcode & QR Block (Clean on white background)
    const bTop = gY + rH * 6 + 14;
    doc.rect(45, bTop, 505, 80).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, bTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Official Barcode (Scan at Registration Gate A)", 60, bTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, bTop + 6, { width: 68, height: 68 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("Scan to Validate", 410, bTop + 72, { align: "center", width: 68 });
    }

    // Section 2: Sponsorship Entitlements (Simple text table)
    const spTop = bTop + 96;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: SPONSORSHIP & PROVISIONED ENTITLEMENTS", 45, spTop);
    doc.moveTo(45, spTop + 11).lineTo(550, spTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const spBoxY = spTop + 16;
    const ents = [
      { i: "Tuition & Delegate Entry Fee", e: "100% Waived (Full State Government Scholarship)", s: "SPONSORED" },
      { i: "Gigabit Campus LAN & Cloud Sandboxes", e: "500 Mbps Dedicated Dual-Fiber + $500 Cloud Credits", s: "PROVISIONED" },
      { i: "27.5-Hour Catering & Hospitality", e: "7 Full Meals + Midnight Refreshment Stations (Dining Pass Attached)", s: "INCLUDED" },
      { i: "FabLab & Makerspace Facilities", e: "i-Hub Rapid Prototyping, 3D Printers, Oscilloscopes & Microcontrollers", s: "AVAILABLE" },
    ];
    doc.rect(45, spBoxY, 505, ents.length * 20).lineWidth(0.5).strokeColor("#000000").stroke();
    ents.forEach((e, idx) => {
      const ey = spBoxY + idx * 20;
      if (idx > 0) doc.moveTo(45, ey).lineTo(550, ey).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(e.i, 52, ey + 5.5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(e.e, 215, ey + 5.5, { width: 245 });
      doc.font("Courier-Bold").fontSize(7).fillColor("#000000").text(e.s, 470, ey + 5.5, { align: "right", width: 70 });
    });

    // Section 3: Essential Reporting Summary
    const repTop = spBoxY + ents.length * 20 + 14;
    doc.rect(45, repTop, 505, 58).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("MANDATORY CANDIDATE REPORTING NOTICE", 55, repTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "All registered innovators must present themselves in person at the i-Hub Ahmedabad Reception on Friday, December 15, 2026 between 08:30 AM and 09:30 AM IST. Turn over to Page 2 for the mandatory document checklist, round progression milestones, and control room directory.",
      55,
      repTop + 20,
      { width: 485, lineGap: 1.5 }
    );
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[CONTINUED ON PAGE 2 OF 2 - PLEASE TURN OVER]", 45, repTop + 46, { align: "right", width: 495 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-ADM-01", "REGISTRATION RECEIPT & ADMISSION DOCKET");

    const p2Top = 80;

    // Section 4: Document Checklist
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 3: MANDATORY DESK VERIFICATION CHECKLIST", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const chkY = p2Top + 16;
    const checks = [
      { b: "[  ]", t: "Original Government Photo Identity", d: "Physical Aadhaar Card, Voter ID, Driver License or Indian Passport for biometric check." },
      { b: "[  ]", t: "Valid College / Institutional Identity Card", d: "Original college student card or Dean-signed bonafide enrollment letter." },
      { b: "[  ]", t: "Signed Security & Anti-Exit Undertaking", d: "Printed & physically counter-signed copy of Attachment 3 (Anti-Exit Protocol)." },
      { b: "[  ]", t: "Parental Overnight Consent Document", d: "Attachment 4 signed by parent/guardian with verifiable emergency mobile number." },
      { b: "[  ]", t: "Hardware Inward Pass Declaration", d: "Serial numbers of laptop and equipment logged for inward gate security tag." },
    ];
    doc.rect(45, chkY, 505, checks.length * 18).lineWidth(0.5).strokeColor("#000000").stroke();
    checks.forEach((c, idx) => {
      const cy = chkY + idx * 18;
      if (idx > 0) doc.moveTo(45, cy).lineTo(550, cy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(c.b, 52, cy + 4);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(c.t + ":", 75, cy + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(c.d, 240, cy + 4, { width: 300 });
    });

    // Section 5: Round Timeline Table
    const tLineTop = chkY + checks.length * 18 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 4: 27.5-HOUR ROUND TIMELINE & EVALUATION MILESTONES", 45, tLineTop);
    doc.moveTo(45, tLineTop + 11).lineTo(550, tLineTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const tlY = tLineTop + 16;
    const sched = [
      { t: "Dec 15 | 09:00 AM - 11:00 AM", s: "Round 1", m: "Physical Check-in, Badge Printing, Kit Distribution & Inaugural Keynote" },
      { t: "Dec 15 | 11:00 AM SHARP", s: "Commencement", m: "27.5-HOUR CONTINUOUS HACKING SPRINT OFFICIALLY BEGINS" },
      { t: "Dec 15 | 04:00 PM - 07:00 PM", s: "Round 2", m: "Milestone 1: Architectural Validation, Problem Mapping & Tech Stack Review" },
      { t: "Dec 15 | 08:30 PM - 10:00 PM", s: "Checkpoint", m: "Dinner Buffet & Progress Checkpoint Sign-off by Domain Mentors" },
      { t: "Dec 16 | 01:30 AM - 04:30 AM", s: "Round 3", m: "Midnight Screening & Jury Pitch: Bottom 25% Elimination Cut Enforced" },
      { t: "Dec 16 | 09:30 AM SHARP", s: "Code Freeze", m: "Devpost Repository Commit Lock: Late submissions immediately rejected" },
      { t: "Dec 16 | 10:30 AM - 12:30 PM", s: "Round 4", m: "Grand Finale Live Stage Demos before VC Jury, Valedictory & Awards" },
    ];
    doc.rect(45, tlY, 505, sched.length * 20).lineWidth(0.5).strokeColor("#000000").stroke();
    sched.forEach((s, idx) => {
      const sy = tlY + idx * 20;
      if (idx > 0) doc.moveTo(45, sy).lineTo(550, sy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(s.t, 52, sy + 5);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(s.s, 220, sy + 5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(s.m, 295, sy + 5, { width: 245 });
    });

    // Section 6: Emergency Directory
    const dirTop = tlY + sched.length * 20 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 5: CONTROL ROOM & EMERGENCY RESPONSE DIRECTORY", 45, dirTop);
    doc.moveTo(45, dirTop + 11).lineTo(550, dirTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const dY = dirTop + 16;
    const direct = [
      { u: "Central Helpdesk", l: "Ground Floor Atrium", p: "+91 79 2630 1234", e: "hackathon@ihubgujarat.in" },
      { u: "Medical Cell & Ambulance", l: "Room 104 (Health Post)", p: "+91 98250 11223", e: "medical@ihubgujarat.in" },
      { u: "Proctorial Security", l: "Main Security Gate A", p: "+91 97123 44556", e: "security@ihubgujarat.in" },
    ];
    doc.rect(45, dY, 505, direct.length * 18).lineWidth(0.5).strokeColor("#000000").stroke();
    direct.forEach((d, idx) => {
      const dy = dY + idx * 18;
      if (idx > 0) doc.moveTo(45, dy).lineTo(550, dy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(d.u, 52, dy + 4.5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(d.l, 175, dy + 4.5);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(d.p, 305, dy + 4.5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(d.e, 420, dy + 4.5);
    });

    // Section 7: Sign-Off Block
    const signTop = dY + direct.length * 18 + 16;
    doc.rect(45, signTop, 505, 90).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("CANDIDATE SOLEMN UNDERTAKING", 55, signTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "I confirm that all particulars provided herein are authentic. I agree to abide by all i-Hub regulations and campus disciplinary rules.",
      55,
      signTop + 20,
      { width: 220, lineGap: 1.5 }
    );
    doc.moveTo(55, signTop + 68).lineTo(235, signTop + 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("Signature of Candidate / Innovator", 55, signTop + 72);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("ADMISSIONS & SCRUTINY COMMITTEE", 300, signTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("GUJARAT STUDENT STARTUP & INNOVATION HUB", 300, signTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Prajna Puram, Navrangpura, Ahmedabad 380015", 300, signTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("DIGITALLY VALIDATED & OFFICIALLY ISSUED", 300, signTop + 48);

    doc.rect(450, signTop + 14, 85, 62).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("OFFICIAL STAMP\n& SEAL\nAT ENTRY", 450, signTop + 30, { align: "center", width: 85 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 2. CATERING & MEAL COUPON PASS (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateFoodPassPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-2026-6953");
  const diet = cleanText(data.foodPreference || "Pure Vegetarian");
  const team = cleanText(data.teamName || "Solo Innovator");
  const passId = `FP-${regId.replace("IHUB-", "")}`;

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|FOOD|${diet.substring(0, 3).toUpperCase()}`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?doc=foodpass`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-HOSP-02", "OFFICIAL FOOD & CATERING COUPON PASS");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("HOSPITALITY, CATERING & DELEGATE WELFARE CELL", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("Annual Innovation Hackathon 2026 | Prajna Puram, Navrangpura, Ahmedabad 380015", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Pass Title
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#000000").text("ALL-INCLUSIVE 27.5-HOUR MEAL & HOSPITALITY PASS", 45, 105, { align: "center", width: 505 });
    doc.moveTo(100, 120).lineTo(495, 120).lineWidth(0.5).strokeColor("#000000").stroke();

    // Identity Table
    const idTop = 130;
    doc.rect(45, idTop, 505, 48).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.moveTo(210, idTop).lineTo(210, idTop + 48).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.moveTo(370, idTop).lineTo(370, idTop + 48).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("REGISTERED PARTICIPANT", 52, idTop + 6);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000").text(name.toUpperCase(), 52, idTop + 18, { width: 150 });
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`Squad: ${team}`, 52, idTop + 32);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("PASS REFERENCE ID", 218, idTop + 6);
    doc.font("Courier-Bold").fontSize(10).fillColor("#000000").text(passId, 218, idTop + 18);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`Reg: ${regId}`, 218, idTop + 32);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("DIETARY PLAN ALLOCATION", 378, idTop + 6);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000").text(diet.toUpperCase(), 378, idTop + 18);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Jain & Swaminarayan segregated", 378, idTop + 32);

    // Barcode Block
    const bTop = idTop + 58;
    doc.rect(45, bTop, 505, 78).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, bTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Scan at Cafeteria Entry Terminal prior to meal collection", 60, bTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, bTop + 6, { width: 66, height: 66 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("Dining Token QR", 410, bTop + 68, { align: "center", width: 66 });
    }

    // Section 1: Detailed 7-Meal Timetable
    const mealTop = bTop + 90;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: OFFICIAL 27.5-HOUR CATERING & MEAL TIMETABLE", 45, mealTop);
    doc.moveTo(45, mealTop + 11).lineTo(550, mealTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const meals = [
      { id: "M-01", meal: "Welcome Breakfast & Tea", window: "Dec 15 | 08:30 AM - 10:00 AM", loc: "Dining Hall A", menu: "Gujarati Poha, Upma, Idli Sambhar, Fresh Chutneys, Tea & Coffee" },
      { id: "M-02", meal: "Executive Grand Lunch Buffet", window: "Dec 15 | 01:00 PM - 02:30 PM", loc: "Central Dining Pavilion", menu: "Paneer Lababdar, Gujarati Kadhi, Khichdi, Phulka Roti, Salad & Sweet" },
      { id: "M-03", meal: "High Tea & Evening Snacks", window: "Dec 15 | 05:00 PM - 06:00 PM", loc: "Atrium Refreshment Deck", menu: "Khaman Dhokla, Samosa with Mint Dip, Cookies & Masala Chai" },
      { id: "M-04", meal: "Dinner Buffet & Progress Fuel", window: "Dec 15 | 08:30 PM - 10:00 PM", loc: "Central Dining Pavilion", menu: "Dal Makhani, Mix Veg Curry, Jeera Rice, Tandoori Roti & Shrikhand" },
      { id: "M-05", meal: "Midnight Energy Boost & Pizza", window: "Dec 16 | 01:30 AM - 02:30 AM", loc: "Tech Lounge Atrium", menu: "Fresh Wood-fired Margherita Pizza, Energy Drinks, Espresso & Cookies" },
      { id: "M-06", meal: "Day 2 Power Breakfast", window: "Dec 16 | 07:30 AM - 09:00 AM", loc: "Dining Hall A", menu: "Methi Thepla, Batata Poha, Sweet Curd, Fresh Fruits, Tea & Coffee" },
      { id: "M-07", meal: "Finale Celebration Lunch", window: "Dec 16 | 12:30 PM - 02:00 PM", loc: "Main Banquet Hall", menu: "Royal Gujarati Thali with Puri, Farsan, Dal Baati Churma & Ice Cream" },
    ];

    const mealTableY = mealTop + 16;
    const mRowH = 35;
    doc.rect(45, mealTableY, 505, meals.length * mRowH).lineWidth(0.5).strokeColor("#000000").stroke();

    meals.forEach((m, idx) => {
      const my = mealTableY + idx * mRowH;
      if (idx > 0) doc.moveTo(45, my).lineTo(550, my).lineWidth(0.5).strokeColor("#000000").stroke();

      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(m.id, 52, my + 6);
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text(m.meal, 85, my + 6);
      doc.font("Courier-Bold").fontSize(7).fillColor("#000000").text(m.window, 345, my + 6, { align: "right", width: 195 });

      doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000").text(`Venue: ${m.loc} | Menu:`, 85, my + 19);
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text(m.menu, 205, my + 19, { width: 335, ellipsis: true });
    });

    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[TURN OVER TO PAGE 2 FOR PHYSICAL VOUCHER STAMP GRID & HYGIENE RULES]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-HOSP-02", "OFFICIAL FOOD & CATERING COUPON PASS");

    const p2Top = 80;

    // Section 2: Dietary Guidelines
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: DIETARY INTEGRITY & ALLERGEN PROTOCOLS", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const dietY = p2Top + 16;
    const dietRules = [
      { t: "Strict Jain Dietary Standards:", d: "Dedicated counters with zero onion, garlic, or root vegetable ingredients prepared in segregated kitchens." },
      { t: "Swaminarayan & Satvik Preparation:", d: "Strict satvik cooking adhering to religious purity standards with dedicated serving personnel." },
      { t: "Allergen Disclosures:", d: "Dairy, gluten, and nut warnings are clearly labeled on every buffet station. Contact hospitality desk for intolerances." },
      { t: "Continuous Hydration & Beverage Stations:", d: "Purified RO water dispensers, tea, coffee, and energy drinks operate 24 hours non-stop." },
    ];
    doc.rect(45, dietY, 505, dietRules.length * 18).lineWidth(0.5).strokeColor("#000000").stroke();
    dietRules.forEach((r, idx) => {
      const dy = dietY + idx * 18;
      if (idx > 0) doc.moveTo(45, dy).lineTo(550, dy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.t, 52, dy + 4.5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(r.d, 195, dy + 4.5, { width: 345 });
    });

    // Section 3: Physical Meal Verification Stamp Grid
    const stTop = dietY + dietRules.length * 18 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 3: PHYSICAL MEAL VOUCHER & STAMP VALIDATION MATRIX", 45, stTop);
    doc.moveTo(45, stTop + 11).lineTo(550, stTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const stY = stTop + 16;
    const vouchers = [
      { code: "V-01", meal: "Day 1 Breakfast", date: "Dec 15 | 08:30 AM" },
      { code: "V-02", meal: "Day 1 Grand Lunch", date: "Dec 15 | 01:00 PM" },
      { code: "V-03", meal: "Day 1 High Tea", date: "Dec 15 | 05:00 PM" },
      { code: "V-04", meal: "Day 1 Dinner Buffet", date: "Dec 15 | 08:30 PM" },
      { code: "V-05", meal: "Midnight Pizza Boost", date: "Dec 16 | 01:30 AM" },
      { code: "V-06", meal: "Day 2 Breakfast", date: "Dec 16 | 07:30 AM" },
      { code: "V-07", meal: "Finale Grand Lunch", date: "Dec 16 | 12:30 PM" },
      { code: "V-08", meal: "Emergency Refreshment", date: "All Times Standby" },
    ];

    const boxW = 120;
    const boxH = 68;
    const gapX = 8.3;
    const gapY = 10;

    vouchers.forEach((v, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const bx = 45 + col * (boxW + gapX);
      const by = stY + row * (boxH + gapY);

      doc.rect(bx, by, boxW, boxH).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(v.code, bx + 5, by + 5);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(v.meal, bx + 32, by + 5, { width: boxW - 36, ellipsis: true });

      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text(v.date, bx + 4, by + 20, { align: "center", width: boxW - 8 });
      doc.rect(bx + 12, by + 32, boxW - 24, 28).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica").fontSize(6).fillColor("#000000").text("CATERING\nOFFICER STAMP", bx + 12, by + 39, { align: "center", width: boxW - 24 });
    });

    // Section 4: Zero Waste Directive
    const ecoTop = stY + 2 * (boxH + gapY) + 12;
    doc.rect(45, ecoTop, 505, 52).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("ZERO-WASTE & CLEAN CAMPUS DIRECTIVE", 55, ecoTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "i-Hub operates an eco-conscious zero-waste campus. All meal packaging is 100% biodegradable and compostable. Innovators must segregate dry and wet waste at all designated disposal stations. Food wastage is strictly monitored by student welfare proctors.",
      55,
      ecoTop + 20,
      { width: 485, lineGap: 1.5 }
    );

    // Section 5: Caterer Validation
    const signTop = ecoTop + 64;
    doc.rect(45, signTop, 505, 78).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("HOSPITALITY & CATERING IN-CHARGE", 55, signTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("CHEF EXECUTIVE & CATERING OFFICER", 55, signTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("State Hospitality Division, i-Hub Ahmedabad", 55, signTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("OFFICIALLY ENDORSED MEAL COUPON", 55, signTop + 48);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("PARTICIPANT ACKNOWLEDGEMENT", 300, signTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`Name: ${name.toUpperCase()} (ID: ${regId})`, 300, signTop + 20);
    doc.moveTo(300, signTop + 54).lineTo(500, signTop + 54).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("Signature of Participant upon Receiving Kit", 300, signTop + 58);

    doc.end();
  });
}

/**
 * ============================================================================
 * 3. SECURITY UNDERTAKING & ANTI-EXIT STATUTORY AGREEMENT (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateSecurityUndertakingPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-2026-6953");
  const team = cleanText(data.teamName || "Solo Innovator");
  const track = cleanText(data.track || "FinTech & Next-Gen Digital Payments");
  const college = cleanText(data.college || "Thakur College of Engineering and Technology");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|SEC|STRICT-NO-EXIT`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?doc=security`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-SEC-03", "SECURITY UNDERTAKING & ANTI-EXIT PROTOCOL");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("PROCTORIAL BOARD & CAMPUS CHIEF SECURITY COMMAND", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015 | Control Room: +91 79 2630 1234", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Document Title
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("STATUTORY ANTI-EXIT AGREEMENT, CAMPUS SECURITY & HARDWARE GATE PASS", 45, 105, { align: "center", width: 505 });
    doc.moveTo(70, 119).lineTo(525, 119).lineWidth(0.5).strokeColor("#000000").stroke();

    // Notice Block
    doc.rect(45, 128, 505, 34).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("LEGAL PROCTORIAL INSTRUMENT - BINDING ON ALL 36-HOUR RESIDENTS", 55, 134);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "This undertaking is executed pursuant to Gujarat Innovation Hub Security Directives. Continuous 27.5-hour campus residence is mandatory. Zero tolerance is strictly maintained for unauthorized perimeter violations.",
      55,
      145,
      { width: 485 }
    );

    // Section 1: Candidate Table
    const sec1Y = 172;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: CANDIDATE IDENTIFICATION & ACCESS RECORD", 45, sec1Y);
    doc.moveTo(45, sec1Y + 11).lineTo(550, sec1Y + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const tY = sec1Y + 16;
    doc.rect(45, tY, 505, 48).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.moveTo(45, tY + 24).lineTo(550, tY + 24).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.moveTo(270, tY).lineTo(270, tY + 48).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("CANDIDATE FULL NAME:", 52, tY + 6);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text(name.toUpperCase(), 160, tY + 6);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("SECURITY REF ID:", 278, tY + 6);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(regId, 375, tY + 6);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("INSTITUTION:", 52, tY + 30);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(college, 160, tY + 30, { width: 105, ellipsis: true });

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("SQUAD / TRACK:", 278, tY + 30);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`${team} | ${track}`, 375, tY + 30, { width: 165, ellipsis: true });

    // Barcode Block
    const barTop = tY + 58;
    doc.rect(45, barTop, 505, 78).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Proctorial Scanner Token - Validated at Perimeter Gate 1 & 2", 60, barTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, barTop + 6, { width: 66, height: 66 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("Gate Security QR", 410, barTop + 68, { align: "center", width: 66 });
    }

    // Section 2: Statutory Anti-Exit Clause
    const lawTop = barTop + 90;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: ARTICLE I - STATUTORY ZERO-TOLERANCE ANTI-EXIT CLAUSE", 45, lawTop);
    doc.moveTo(45, lawTop + 11).lineTo(550, lawTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const lawBoxY = lawTop + 16;
    const articles = [
      { num: "1.1", text: "CONTINUOUS ON-CAMPUS CONFINEMENT: From official commencement (Dec 15, 11:00 AM) to formal valedictory (Dec 16, 12:30 PM), all candidates must continuously remain within designated i-Hub academic zones." },
      { num: "1.2", text: "STRICT PERIMETER VIOLATION PENALTY: Stepping outside campus perimeter gates without authorized counter-signed security pass from the Chief Proctor results in IMMEDIATE PERMANENT DISQUALIFICATION of the candidate and their entire squad." },
      { num: "1.3", text: "FORFEITURE & INSTITUTIONAL NOTICE: In the event of unauthorized exit, all cash awards, incubation grants, certificates, and travel stipends are irrevocably forfeited, and a formal disciplinary report is dispatched to the candidate's Dean/Principal." },
      { num: "1.4", text: "ROUND 3 MIDNIGHT ELIMINATION CUT: Teams failing to pass the Round 3 Midnight Jury screening (01:30 AM - 04:30 AM) remain in supervised rest lounges until 06:00 AM before scheduled exit." },
    ];
    doc.rect(45, lawBoxY, 505, articles.length * 28).lineWidth(0.5).strokeColor("#000000").stroke();
    articles.forEach((art, idx) => {
      const ay = lawBoxY + idx * 28;
      if (idx > 0) doc.moveTo(45, ay).lineTo(550, ay).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(art.num, 52, ay + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(art.text, 72, ay + 4, { width: 468, lineGap: 1.2 });
    });

    // Section 3: Hardware Inward Declaration Table
    const hwTop = lawBoxY + articles.length * 28 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 3: HARDWARE & EQUIPMENT INWARD GATE PASS DECLARATION", 45, hwTop);
    doc.moveTo(45, hwTop + 11).lineTo(550, hwTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const hwY = hwTop + 16;
    const hwItems = [
      { item: "Primary Laptop & Power Adapter", model: "Authorized for Coding Lab", serial: "VERIFIED AT ENTRY", tag: "GATE-PASS-IN" },
      { item: "Microcontrollers / IoT Development Boards", model: "Raspberry Pi / Arduino / ESP32", serial: "LOGGED IN LAB LOG", tag: "PERMITTED" },
      { item: "Smartphones & Mobile Testing Devices", model: "Camera & Sensor Enabled", serial: "PERSONAL USE", tag: "PERMITTED" },
      { item: "High-Draw Appliances (Heaters, Kettles)", model: "RESTRICTED HAZARD", serial: "STRICTLY PROHIBITED", tag: "CONFISCATED" },
    ];
    doc.rect(45, hwY, 505, hwItems.length * 19).lineWidth(0.5).strokeColor("#000000").stroke();
    hwItems.forEach((h, idx) => {
      const hy = hwY + idx * 19;
      if (idx > 0) doc.moveTo(45, hy).lineTo(550, hy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(h.item, 52, hy + 5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(h.model, 210, hy + 5);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(h.serial, 370, hy + 5);
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000").text(h.tag, 470, hy + 5, { align: "right", width: 70 });
    });

    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[TURN OVER TO PAGE 2 FOR CYBER INTEGRITY, MEDICAL SAFETY & SIGN-OFF]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-SEC-03", "SECURITY UNDERTAKING & ANTI-EXIT PROTOCOL");

    const p2Top = 80;

    // Section 4: Cyber Security
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 4: CYBER CONDUCT, NETWORK INTEGRITY & INTELLECTUAL PROPERTY", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const netY = p2Top + 16;
    const netRules = [
      { t: "Campus Network Honor Code:", d: "Strict ban on ARP spoofing, packet sniffing, unauthorized port scanning, or intrusive penetration against peer devices or venue network." },
      { t: "Originality & Plagiarism Statute:", d: "All code must be authored afresh during the official 27.5-hour period. Open-source libraries must be declared in repo README." },
      { t: "Substance & Behavioral Zero-Tolerance:", d: "Possession or consumption of alcohol, narcotics, smoking devices, or contraband is strictly banned under Gujarat state laws." },
      { t: "Intellectual Property Ownership:", d: "Innovators retain 100% intellectual property ownership of their source code, patents, and prototypes developed at i-Hub." },
    ];
    doc.rect(45, netY, 505, netRules.length * 21).lineWidth(0.5).strokeColor("#000000").stroke();
    netRules.forEach((r, idx) => {
      const ny = netY + idx * 21;
      if (idx > 0) doc.moveTo(45, ny).lineTo(550, ny).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.t, 52, ny + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(r.d, 195, ny + 4, { width: 345, lineGap: 1.2 });
    });

    // Section 5: Medical
    const medTop = netY + netRules.length * 21 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 5: MEDICAL DISCLOSURE, FIRST AID & EMERGENCY RESPONSE", 45, medTop);
    doc.moveTo(45, medTop + 11).lineTo(550, medTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const medY = medTop + 16;
    const medPoints = [
      { q: "Pre-existing Medical Conditions / Allergies:", a: "None declared (Fit for intensive 27.5-hour innovation sprint)." },
      { q: "On-site 24x7 Medical Station:", a: "Room 104, Ground Floor (Doctor on duty, paramedic and basic trauma life support)." },
      { q: "Designated Emergency Trauma Hospital:", a: "Civil Hospital Ahmedabad / Sterling Hospital (Dedicated emergency ambulance on campus)." },
      { q: "Campus Emergency Helpline:", a: "+91 98250 11223 (Medical Officer) | +91 79 2630 1234 (Command Center)" },
    ];
    doc.rect(45, medY, 505, medPoints.length * 19.5).lineWidth(0.5).strokeColor("#000000").stroke();
    medPoints.forEach((p, idx) => {
      const py = medY + idx * 19.5;
      if (idx > 0) doc.moveTo(45, py).lineTo(550, py).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(p.q, 52, py + 5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(p.a, 245, py + 5, { width: 295 });
    });

    // Section 6: Tripartite Sign-Off
    const signTop = medY + medPoints.length * 19.5 + 16;
    doc.rect(45, signTop, 505, 126).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("1. CANDIDATE SOLEMN UNDERTAKING", 55, signTop + 8);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(
      "I solemnly swear that I have meticulously read the anti-exit regulations. I accept that exiting campus without permission causes instant disqualification.",
      55,
      signTop + 18,
      { width: 220, lineGap: 1 }
    );
    doc.moveTo(55, signTop + 54).lineTo(235, signTop + 54).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(`Signature: ${name.toUpperCase()}`, 55, signTop + 58);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("2. PARENTAL / GUARDIAN AFFIRMATION", 285, signTop + 8);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(
      "I have permitted my ward to participate in this overnight hackathon and accept all proctorial supervision policies of i-Hub Gujarat.",
      285,
      signTop + 18,
      { width: 240, lineGap: 1 }
    );
    doc.moveTo(285, signTop + 54).lineTo(480, signTop + 54).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("Signature / OTP 2FA Verified by Parent", 285, signTop + 58);

    doc.moveTo(45, signTop + 74).lineTo(550, signTop + 74).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("3. CHIEF PROCTOR & CAMPUS SECURITY WARDEN ENDORSEMENT", 55, signTop + 80);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("OFFICE OF THE CHIEF SECURITY OFFICER - i-HUB AHMEDABAD", 55, signTop + 92);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Prajna Puram, Navrangpura, Ahmedabad 380015 | Seal & Security Sign-off", 55, signTop + 104);

    doc.rect(430, signTop + 78, 105, 42).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000").text("CAMPUS SECURITY GATE\nCHECK-IN CLEARED\nINWARD PERMIT", 430, signTop + 86, { align: "center", width: 105 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 4. PARENTAL CONSENT FORM (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateParentalConsentPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-2026-6953");
  const parentName = cleanText(data.parentName || (data.parentalApproval && data.parentalApproval.parentName) || "Jagdish Suthar");
  const parentPhone = cleanText(data.parentPhone || (data.parentalApproval && data.parentalApproval.parentPhone) || "9768440000");
  const parentEmail = cleanText(data.parentEmail || (data.parentalApproval && data.parentalApproval.parentEmail) || "hiteshsutharbackup@gmail.com");
  const college = cleanText(data.college || "Thakur College of Engineering and Technology");
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|PARENT|${parentPhone}`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?doc=parental`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-PAR-04", "PARENTAL OVERNIGHT PARTICIPATION CONSENT");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("STUDENT WELFARE & PARENTAL LIAISON DIVISION", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("KCG Campus, Opp. PRL, Navrangpura, Ahmedabad 380015 | Student Welfare Desk", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Title
    doc.font("Helvetica-Bold").fontSize(11.5).fillColor("#000000").text("FORMAL PARENTAL / GUARDIAN OVERNIGHT CONSENT & MEDICAL APPROVAL", 45, 105, { align: "center", width: 505 });
    doc.moveTo(60, 119).lineTo(535, 119).lineWidth(0.5).strokeColor("#000000").stroke();

    // Memo
    doc.rect(45, 128, 505, 42).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("FORMAL DISPATCH TO PARENT / LEGAL GUARDIAN", 55, 134);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      `Dear ${parentName}, this document records your official consent for your son/daughter/ward, ${name}, to participate in the overnight 27.5-hour i-Hub Gujarat Innovation Hackathon 2026. Please inspect the event scope, residential security guarantees, and emergency contacts below.`,
      55,
      145,
      { width: 485, lineGap: 1.5 }
    );

    // Section 1: Candidate Table
    const sec1Top = 180;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: PARTICIPANT & PARENT IDENTITY REGISTRATION", 45, sec1Top);
    doc.moveTo(45, sec1Top + 11).lineTo(550, sec1Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const tY = sec1Top + 16;
    const rH = 22;
    doc.rect(45, tY, 505, rH * 5).lineWidth(0.5).strokeColor("#000000").stroke();
    for (let i = 1; i < 5; i++) {
      doc.moveTo(45, tY + i * rH).lineTo(550, tY + i * rH).lineWidth(0.5).strokeColor("#000000").stroke();
    }
    doc.moveTo(270, tY).lineTo(270, tY + rH * 5).lineWidth(0.5).strokeColor("#000000").stroke();

    const pRows = [
      { l1: "STUDENT NAME:", v1: name.toUpperCase(), l2: "REGISTRATION REF:", v2: regId },
      { l1: "COLLEGE / INSTITUTION:", v1: college, l2: "STUDENT STATUS:", v2: "Regular Bonafide Student" },
      { l1: "PARENT / GUARDIAN:", v1: parentName, l2: "RELATIONSHIP:", v2: "Parent / Legal Guardian" },
      { l1: "PRIMARY EMERGENCY PHONE:", v1: parentPhone, l2: "PARENT EMAIL:", v2: parentEmail },
      { l1: "RESIDENTIAL CAMPUS:", v1: "i-Hub Campus, Ahmedabad", l2: "CONSENT STATUS:", v2: "Dual-OTP 2FA Authenticated" },
    ];
    pRows.forEach((r, idx) => {
      const cy = tY + idx * rH;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l1, 52, cy + 6);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(r.v1, 155, cy + 6, { width: 110, ellipsis: true });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l2, 278, cy + 6);
      doc.font(idx === 0 ? "Courier-Bold" : "Helvetica").fontSize(7.5).fillColor("#000000").text(r.v2, 385, cy + 6, { width: 160, ellipsis: true });
    });

    // Barcode Block
    const barTop = tY + rH * 5 + 14;
    doc.rect(45, barTop, 505, 78).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Parental Approval Security Hash (Logged in Admissions Audit Vault)", 60, barTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, barTop + 6, { width: 66, height: 66 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("Parent Audit QR", 410, barTop + 68, { align: "center", width: 66 });
    }

    // Section 2: Event Scope
    const schTop = barTop + 90;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: EVENT SCOPE, RESIDENTIAL SCHEDULE & VENUE TIMINGS", 45, schTop);
    doc.moveTo(45, schTop + 11).lineTo(550, schTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const schBoxY = schTop + 16;
    const schedItems = [
      { f: "Check-in & Reporting Window:", d: "Friday, December 15, 2026 | 08:30 AM to 09:30 AM IST (Parents may escort candidate)" },
      { f: "27.5-Hour Non-Stop Sprint:", d: "Commences Dec 15 at 11:00 AM; concludes Saturday, December 16 at 12:30 PM" },
      { f: "Overnight Accommodation:", d: "Dedicated, secure indoor rest dormitories on campus with female/male segregation" },
      { f: "Grand Valedictory & Release:", d: "Saturday, December 16, 2026 | 12:30 PM to 01:30 PM (Departure authorized)" },
      { f: "Campus Boundary Enforcement:", d: "Gates are locked throughout the event. Candidates cannot exit under any circumstance." },
    ];
    doc.rect(45, schBoxY, 505, schedItems.length * 17).lineWidth(0.5).strokeColor("#000000").stroke();
    schedItems.forEach((s, idx) => {
      const sy = schBoxY + idx * 17;
      if (idx > 0) doc.moveTo(45, sy).lineTo(550, sy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(s.f, 52, sy + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(s.d, 195, sy + 4, { width: 345 });
    });

    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[TURN OVER TO PAGE 2 FOR RESIDENTIAL GUARANTEES, MEDICAL CONSENT & SIGNATURES]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-PAR-04", "PARENTAL OVERNIGHT PARTICIPATION CONSENT");

    const p2Top = 80;

    // Section 3: Campus Safety
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 3: RESIDENTIAL SUPERVISION, DORMITORY SAFETY & WELFARE GUARANTEES", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const safeY = p2Top + 16;
    const safePoints = [
      { t: "1. 24x7 Security & CCTV Surveillance:", d: "The entire 5-acre i-Hub campus is monitored continuously by high-definition CCTV cameras and licensed security personnel with restricted perimeter access." },
      { t: "2. Segregated Rest & Dormitory Lounges:", d: "Dedicated, air-conditioned resting spaces are provisioned with strict gender segregation. Female dormitories are managed exclusively by female wardens and guards." },
      { t: "3. On-Site Medical Desk & Paramedics:", d: "A fully equipped primary health center operates 24 hours with certified physicians, emergency medicines, and an on-call ambulance." },
      { t: "4. Wholesome Hygienic Catering:", d: "All 7 meals and midnight snacks are prepared fresh by certified FSSAI caterers on campus. Purified water stations are located across every laboratory." },
    ];
    doc.rect(45, safeY, 505, safePoints.length * 24).lineWidth(0.5).strokeColor("#000000").stroke();
    safePoints.forEach((sp, idx) => {
      const spy = safeY + idx * 24;
      if (idx > 0) doc.moveTo(45, spy).lineTo(550, spy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(sp.t, 52, spy + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(sp.d, 52, spy + 14, { width: 485, lineGap: 1 });
    });

    // Section 4: Medical Authorization
    const medTop = safeY + safePoints.length * 24 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 4: EMERGENCY MEDICAL TREATMENT AUTHORIZATION", 45, medTop);
    doc.moveTo(45, medTop + 11).lineTo(550, medTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const medBoxY = medTop + 16;
    doc.rect(45, medBoxY, 505, 66).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("STATUTORY MEDICAL EMPOWERMENT COVENANT", 55, medBoxY + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "In the improbable event of acute illness, injury, or medical emergency, I hereby empower the designated Medical Officer and Student Welfare Committee of i-Hub Gujarat to administer emergency first aid, prescribe medications, or arrange hospital admission (Civil Hospital / Sterling Hospital) while promptly notifying me via the emergency contact numbers on record.",
      55,
      medBoxY + 20,
      { width: 485, lineGap: 1.5 }
    );

    // Section 5: Digital 2FA Audit
    const auditTop = medBoxY + 76;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 5: DIGITAL 2FA AUTHENTICATION AUDIT TRAIL", 45, auditTop);
    doc.moveTo(45, auditTop + 11).lineTo(550, auditTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const aBoxY = auditTop + 16;
    doc.rect(45, aBoxY, 505, 46).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("PARENT EMAIL AUTHENTICATED:", 52, aBoxY + 6);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(parentEmail, 200, aBoxY + 6);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("6-DIGIT OTP AUDIT VERIFIED:", 52, aBoxY + 20);
    doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text("PASS (Cryptographically Verified)", 200, aBoxY + 20);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("TIMESTAMP OF CONSENT:", 52, aBoxY + 34);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(`${dateStr} | Logged via i-Hub Portal Gateway`, 200, aBoxY + 34);

    // Section 6: Signatures
    const signTop = aBoxY + 58;
    doc.rect(45, signTop, 505, 96).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("PARENT / GUARDIAN SIGNATURE & AFFIRMATION", 55, signTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "I confirm that I have willingly permitted my ward to participate in the i-Hub Gujarat Innovation Hackathon 2026 and agree to all terms stated herein.",
      55,
      signTop + 20,
      { width: 230, lineGap: 1.2 }
    );
    doc.moveTo(55, signTop + 68).lineTo(235, signTop + 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text(`Signature: ${parentName}`, 55, signTop + 72);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(`Date: ${dateStr} | Mobile: ${parentPhone}`, 55, signTop + 82);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("i-HUB ADMISSIONS & WELFARE BOARD", 305, signTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("DIRECTORATE OF STUDENT INNOVATION", 305, signTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Government of Gujarat Innovation Hub, Ahmedabad", 305, signTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("CONSENT DULY RECORDED & ARCHIVED", 305, signTop + 48);

    doc.rect(450, signTop + 14, 85, 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("PARENTAL\nCONSENT\nAUDIT SEAL", 450, signTop + 34, { align: "center", width: 85 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 5. MASTER HACKER PASS (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateOfficialHackerPassPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-2026-6953");
  const team = cleanText(data.teamName || "Solo Innovator");
  const track = cleanText(data.track || "FinTech & Next-Gen Digital Payments");
  const booth = cleanText(data.boothNumber || "Booth #A-14");
  const diet = cleanText(data.foodPreference || "Pure Vegetarian");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|MASTER-PASS|${booth}`),
    createQrCodeBuffer(`https://ihubgujarat.in/pass/${regId}`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-PASS-05", "MASTER OFFICIAL HACKER BOARDING PASS");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("GUJARAT INNOVATION HACKATHON 2026 - OFFICIAL BOARDING PASS", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015 | Physical Access Docket", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Title
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#000000").text("OFFICIAL HACKER BOARDING PASS & ACCESS PERMIT", 45, 105, { align: "center", width: 505 });
    doc.moveTo(90, 120).lineTo(505, 120).lineWidth(0.5).strokeColor("#000000").stroke();

    // Hacker details grid
    const gTop = 132;
    doc.rect(45, gTop, 505, 90).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.moveTo(320, gTop).lineTo(320, gTop + 90).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("DELEGATE / INNOVATOR NAME", 55, gTop + 8);
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#000000").text(name.toUpperCase(), 55, gTop + 20);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("REGISTRATION REFERENCE ID", 55, gTop + 40);
    doc.font("Courier-Bold").fontSize(10.5).fillColor("#000000").text(regId, 55, gTop + 52);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("SQUAD / TRACK ALLOCATION", 55, gTop + 68);
    doc.font("Helvetica").fontSize(8.5).fillColor("#000000").text(`${team} | ${track}`, 55, gTop + 78, { width: 250, ellipsis: true });

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("ASSIGNED BOOTH:", 330, gTop + 14);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#000000").text(booth, 415, gTop + 12);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("DIETARY PLAN:", 330, gTop + 40);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text(diet.toUpperCase(), 415, gTop + 39);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text("SCHEDULE:", 330, gTop + 66);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Dec 15, 09:00 AM - Dec 16, 12:30 PM", 415, gTop + 66);

    // Barcode Block
    const barTop = gTop + 100;
    doc.rect(45, barTop, 505, 80).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Master Boarding Barcode - Scan for Auditorium, Lab & FabLab Entry", 60, barTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, barTop + 6, { width: 68, height: 68 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("Live Pass QR", 410, barTop + 72, { align: "center", width: 68 });
    }

    // Schedule Overview
    const schedTop = barTop + 92;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: 4-STAGE ROUND CHRONOLOGY & EVALUATION TIMELINE", 45, schedTop);
    doc.moveTo(45, schedTop + 11).lineTo(550, schedTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const tRows = [
      { t: "Dec 15 | 09:00 AM - 11:00 AM", r: "Round 1: Check-in, Badge Printing, Kit Bag Collection & Keynote" },
      { t: "Dec 15 | 11:00 AM", r: "HACKATHON COMMENCES (27.5-Hour Non-stop Sprint Begins)" },
      { t: "Dec 15 | 04:00 PM - 07:00 PM", r: "Round 2: Architecture Review & Mentorship Milestones" },
      { t: "Dec 15 | 08:30 PM", r: "Dinner Buffet & Progress Checkpoint Sign-off" },
      { t: "Dec 16 | 01:30 AM - 04:30 AM", r: "Round 3: Midnight Jury Screening (Bottom 25% Elimination Cut)" },
      { t: "Dec 16 | 09:30 AM", r: "CODE FREEZE: Devpost Repository Submissions Locked" },
      { t: "Dec 16 | 10:30 AM - 12:30 PM", r: "Round 4: Grand Finale Stage Pitches before VC Jury & Awards" },
    ];
    let scY = schedTop + 18;
    tRows.forEach((item) => {
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(item.t, 52, scY);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(item.r, 220, scY, { width: 320 });
      scY += 16;
    });

    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[TURN OVER TO PAGE 2 FOR ACCESS ZONES, DISCIPLINARY DIRECTIVES & SIGNATURES]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-PASS-05", "MASTER OFFICIAL HACKER BOARDING PASS");

    const p2Top = 80;

    // Section 2: Access Privileges
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: CAMPUS ZONE ACCESS PRIVILEGES & PASS CLEARANCE", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const zoneY = p2Top + 16;
    const zones = [
      { z: "Zone 1: Main Coding Arena & Tech Atrium", a: "UNRESTRICTED ACCESS", c: "Dedicated high-speed desk, ergonomic seating & dual power ports." },
      { z: "Zone 2: i-Hub Makerspace & IoT FabLab", a: "AUTHORIZED CLEARANCE", c: "Access to 3D rapid prototyping, PCB solder stations & test equipment." },
      { z: "Zone 3: Mentor & Jury Pitch Suites", a: "BY APPOINTMENT", c: "Round 2 & Round 3 evaluation suites with private meeting docks." },
      { z: "Zone 4: Overnight Rest Lounges & Dorms", a: "BIOMETRIC ENTRY", c: "Segregated, supervised rest quarters with female-only secured wings." },
    ];
    doc.rect(45, zoneY, 505, zones.length * 24).lineWidth(0.5).strokeColor("#000000").stroke();
    zones.forEach((zn, idx) => {
      const zy = zoneY + idx * 24;
      if (idx > 0) doc.moveTo(45, zy).lineTo(550, zy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text(zn.z, 52, zy + 4);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(zn.a, 380, zy + 4, { align: "right", width: 155 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(zn.c, 52, zy + 14, { width: 485 });
    });

    // Warning
    const warnTop = zoneY + zones.length * 24 + 14;
    doc.rect(45, warnTop, 505, 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("MANDATORY CAMPUS DISQUALIFICATION WARNING", 55, warnTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      "The campus gates are strictly sealed throughout the 27.5-hour hackathon. Stepping outside the campus perimeter without authorized written permission from the Chief Warden results in IMMEDIATE PERMANENT DISQUALIFICATION alongside your entire squad with no second chance.",
      55,
      warnTop + 20,
      { width: 485, lineGap: 1.8 }
    );

    // Signatures
    const passSignTop = warnTop + 82;
    doc.rect(45, passSignTop, 505, 96).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("ORGANIZING AUTHORITY", 55, passSignTop + 8);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("i-HUB ADMISSIONS & JURY COMMITTEE", 55, passSignTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Government of Gujarat Innovation Hub, Ahmedabad", 55, passSignTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("OFFICIALLY ISSUED BOARDING PASS", 55, passSignTop + 52);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("HACKER IDENTIFICATION", 300, passSignTop + 8);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text(`NAME: ${name.toUpperCase()}`, 300, passSignTop + 20);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(`REF ID: ${regId}`, 300, passSignTop + 34);
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text(`BOOTH: ${booth}`, 300, passSignTop + 48);

    doc.rect(440, passSignTop + 14, 95, 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("OFFICIAL\nINNOVATION HUB\nEMBOSSED SEAL", 440, passSignTop + 34, { align: "center", width: 95 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 6. DELHI INNOVATION & SAAS ACCELERATION BOOTCAMP NOMINATION (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateDelhiSaasNominationPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-DELHI-SAAS-2026-084");
  const college = cleanText(data.college || "Thakur College of Engineering and Technology");
  const track = cleanText(data.track || "FinTech & Next-Gen Enterprise SaaS");
  const projectTitle = cleanText(data.projectTitle || "Autonomous Enterprise Fraud Detection & High-Throughput Payment Orchestrator");
  const campDates = cleanText(data.campDates || "January 18, 2027 – January 22, 2027 (5-Day Residential)");
  const campVenue = cleanText(data.campVenue || "MeitY Innovation Complex, Electronics Niketan, CGO Complex, Lodhi Road, New Delhi 110003");
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|DELHI-SAAS|NOMINATED`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/delhi-cohort/${regId}`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-DELHI-06", "DELHI INNOVATION & SAAS ACCELERATION NOMINATION");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT & MINISTRY OF ELECTRONICS & IT (MeitY)", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("GUJARAT STUDENT STARTUP & INNOVATION HUB (i-HUB) IN PARTNERSHIP WITH MeitY STARTUP HUB", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("National Innovation & SaaS Fellowship Mission | Electronics Niketan, Lodhi Road, New Delhi & Ahmedabad", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Ref & Date
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(`GAZETTE ORDER REF: IHUB/DELHI-SAAS-DEPUTATION/2026/084`, 45, 98);
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text(`DATE OF NOTIFICATION: ${dateStr.toUpperCase()}`, 350, 98, { align: "right", width: 195 });

    // Title
    doc.font("Helvetica-Bold").fontSize(11.5).fillColor("#000000").text("OFFICIAL NOMINATION & SPONSORED STATE DEPUTATION ORDER", 45, 116, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#000000").text("DELHI INNOVATION & SAAS ACCELERATION BOOTCAMP - NATIONAL COHORT 2026-27", 45, 131, { align: "center", width: 505 });
    doc.moveTo(60, 142).lineTo(535, 142).lineWidth(0.5).strokeColor("#000000").stroke();

    // Notice
    const preY = 152;
    doc.rect(45, preY, 505, 48).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("EXECUTIVE SELECTION & DEPUTATION NOTICE", 55, preY + 6);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      `Pursuant to the joint technical evaluation by the i-Hub Gujarat Scrutiny Board and the National SaaS Evaluation Council, we are pleased to officially notify that ${name.toUpperCase()} has been SELECTED to represent the State of Gujarat as an Official Innovation Delegate at the prestigious Delhi Innovation & SaaS Acceleration Bootcamp in New Delhi.`,
      55,
      preY + 18,
      { width: 485, lineGap: 1.5 }
    );

    // Table
    const regTop = preY + 58;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: DEPUTED FELLOW & PROJECT IDENTIFICATION", 45, regTop);
    doc.moveTo(45, regTop + 11).lineTo(550, regTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const gY = regTop + 16;
    const rH = 22;
    doc.rect(45, gY, 505, rH * 5).lineWidth(0.5).strokeColor("#000000").stroke();
    for (let i = 1; i < 5; i++) {
      doc.moveTo(45, gY + i * rH).lineTo(550, gY + i * rH).lineWidth(0.5).strokeColor("#000000").stroke();
    }
    doc.moveTo(270, gY).lineTo(270, gY + rH * 5).lineWidth(0.5).strokeColor("#000000").stroke();

    const dRows = [
      { l1: "DEPUTED CANDIDATE:", v1: name.toUpperCase(), l2: "NOMINATION REF:", v2: regId, f2: "Courier-Bold" },
      { l1: "INSTITUTION / COLLEGE:", v1: college, l2: "SPECIALIZATION TRACK:", v2: track },
      { l1: "PROJECT TITLE:", v1: projectTitle, l2: "FELLOWSHIP MERIT:", v2: "State Merit Rank #04 (A+ Grade)" },
      { l1: "BOOTCAMP DATES:", v1: campDates, l2: "CAMP VENUE:", v2: "MeitY Innovation Complex, New Delhi" },
      { l1: "SPONSORSHIP STATUS:", v1: "100% Fully Funded (State Grant)", l2: "TRANSIT STATUS:", v2: "Confirmed Travel Pass Provisioned" },
    ];
    dRows.forEach((r, idx) => {
      const cy = gY + idx * rH;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l1, 52, cy + 6);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(r.v1, 155, cy + 6, { width: 110, ellipsis: true });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l2, 278, cy + 6);
      doc.font(r.f2 || "Helvetica").fontSize(7.5).fillColor("#000000").text(r.v2, 385, cy + 6, { width: 160, ellipsis: true });
    });

    // Barcode Block
    const barTop = gY + rH * 5 + 14;
    doc.rect(45, barTop, 505, 78).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("National Deputation Order Barcode - Scan for Transit & Delhi Campus Check-in", 60, barTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, barTop + 6, { width: 68, height: 68 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("National Registry QR", 410, barTop + 72, { align: "center", width: 68 });
    }

    // Section 2: Sponsorship Entitlements
    const grantTop = barTop + 90;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: 100% SPONSORSHIP SCHEDULE & LOGISTICAL ENTITLEMENTS", 45, grantTop);
    doc.moveTo(45, grantTop + 11).lineTo(550, grantTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const gBoxY = grantTop + 16;
    const sponItems = [
      { item: "Return Inter-State Transit (Air/Executive Rail)", ent: "Full 100% reimbursement from Mumbai/Ahmedabad to New Delhi & return", cat: "SPONSORED" },
      { item: "Executive Residential Accommodation in Delhi", ent: "5-Night twin-sharing residential lodging at MeitY Transit House / Guest House", cat: "PROVISIONED" },
      { item: "Enterprise SaaS Cloud & GPU Infrastructure", ent: "$5,000 USD AWS / Google Cloud Enterprise SaaS Acceleration Sandbox Credits", cat: "ALLOCATED" },
      { item: "Closed-Door Tier-1 VC Pitch Access", ent: "1-on-1 scheduled pitch docks before Peak XV, Elevation Capital, and Accel Partners", cat: "EXCLUSIVE" },
    ];
    doc.rect(45, gBoxY, 505, sponItems.length * 19).lineWidth(0.5).strokeColor("#000000").stroke();
    sponItems.forEach((sp, idx) => {
      const sy = gBoxY + idx * 19;
      if (idx > 0) doc.moveTo(45, sy).lineTo(550, sy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(sp.item, 52, sy + 5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(sp.ent, 215, sy + 5, { width: 235 });
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(sp.cat, 460, sy + 5, { align: "right", width: 80 });
    });

    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[TURN OVER TO PAGE 2 FOR CURRICULUM, VC JURY SCHEDULE & OFFICIAL SIGN-OFF]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-DELHI-06", "DELHI INNOVATION & SAAS ACCELERATION NOMINATION");

    const p2Top = 80;

    // Section 3: Curriculum
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 3: 5-DAY RESIDENTIAL ACCELERATION CURRICULUM & MILESTONES", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const currY = p2Top + 16;
    const days = [
      { day: "Day 1 (Jan 18)", title: "Cohort Onboarding & Enterprise Multi-Tenant Architecture", desc: "Keynote by MeitY leadership; audit of database isolation, distributed caching, and tenant partitioning." },
      { day: "Day 2 (Jan 19)", title: "FinTech Compliance, SOC2, PCI-DSS & Global API Security", desc: "Masterclasses by chief compliance officers; regulatory sandboxing and automated API threat mitigation." },
      { day: "Day 3 (Jan 20)", title: "Cross-Border SaaS Go-To-Market & US Expansion Strategy", desc: "Enterprise outbound sales pipelines, US Delaware entity structuring, pricing models, and international billing." },
      { day: "Day 4 (Jan 21)", title: "Institutional Mock Pitches & Term Sheet Negotiation", desc: "Intensive 1-on-1 pitch drills with managing directors from top-tier institutional early-stage funds." },
      { day: "Day 5 (Jan 22)", title: "National Demo Day before Institutional VCs & Valedictory", desc: "Live stage presentations at the Main Auditorium before 40+ VCs, angel syndicates, and press corps." },
    ];
    doc.rect(45, currY, 505, days.length * 27).lineWidth(0.5).strokeColor("#000000").stroke();
    days.forEach((d, idx) => {
      const dy = currY + idx * 27;
      if (idx > 0) doc.moveTo(45, dy).lineTo(550, dy).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(d.day, 52, dy + 5);
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text(d.title, 140, dy + 5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(d.desc, 140, dy + 15, { width: 400 });
    });

    // Section 4: Reporting
    const protTop = currY + days.length * 27 + 14;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 4: REPORTING PROTOCOL & NEW DELHI TRANSIT LIAISON", 45, protTop);
    doc.moveTo(45, protTop + 11).lineTo(550, protTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const prBoxY = protTop + 16;
    const pRules = [
      { r: "Reporting Window:", t: "Monday, January 18, 2027 by 09:00 AM IST at MeitY Innovation Complex, Lodhi Road, New Delhi." },
      { r: "Airport / Railway Transit:", t: "Dedicated i-Hub / MeitY helpdesks operate at IGI Airport (T3) and New Delhi Railway Station (Ajmeri Gate)." },
      { r: "Identification Requirement:", t: "Deputed candidates must carry original Aadhaar Card and this countersigned Deputation Order." },
      { r: "Official Contact Liaison:", t: "National Cohort Desk: delhi-saas@ihubgujarat.in | Emergency Helpline: +91 11 2436 0199" },
    ];
    doc.rect(45, prBoxY, 505, pRules.length * 17).lineWidth(0.5).strokeColor("#000000").stroke();
    pRules.forEach((pr, idx) => {
      const pry = prBoxY + idx * 17;
      if (idx > 0) doc.moveTo(45, pry).lineTo(550, pry).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(pr.r, 55, pry + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(pr.t, 185, pry + 4, { width: 355 });
    });

    // Section 5: Signatures
    const sTop = prBoxY + pRules.length * 17 + 16;
    doc.rect(45, sTop, 505, 96).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("STATE DEPUTATION AUTHORITY", 55, sTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("DIRECTOR - INNOVATION & RESEARCH", 55, sTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Gujarat Student Startup and Innovation Hub (i-Hub)", 55, sTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("OFFICIALLY COUNTERSIGNED & SEALED", 55, sTop + 48);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(`Order Dispatched: ${dateStr}`, 55, sTop + 62);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("CENTRAL MISSION LIAISON", 280, sTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("CHIEF EXECUTIVE - MeitY STARTUP HUB", 280, sTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Ministry of Electronics & Information Technology, New Delhi", 280, sTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("NATIONAL COHORT SEAT CONFIRMED", 280, sTop + 48);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(`Candidate: ${name.toUpperCase()} (TCET)`, 280, sTop + 62);

    doc.rect(450, sTop + 14, 85, 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000").text("MeitY STARTUP HUB\n& i-HUB GUJARAT\nOFFICIAL SEAL", 450, sTop + 28, { align: "center", width: 85 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 7. STAGE 1 TECHNICAL EVALUATION VERDICT & ALL-INDIA MERIT PROTOCOL (SIMPLE NORMAL TEXT FORMAT - 2 PAGES)
 * ============================================================================
 */
async function generateProjectStage1MeritPdf(data = {}) {
  const name = cleanText(data.participantName || "SUTHAR HITESH JAGDISH");
  const regId = cleanText(data.registrationId || "IHUB-2026-6953");
  const college = cleanText(data.college || "Thakur College of Engineering and Technology");
  const track = cleanText(data.track || "FinTech & Next-Gen Digital Payments");
  const projectTitle = cleanText(data.projectTitle || "Autonomous Enterprise Payment Orchestrator & Distributed Ledger Verification Engine");
  const score = cleanText(data.evaluationScore || "94.5 / 100");
  const rank = cleanText(data.meritRank || "State Rank #04 (Top 1.5% Percentile - Tier A+)");
  const targetEmail = cleanText(data.stage2EmailTarget || "hiteshjagdishsuthar@gmail.com");
  const meritDate = cleanText(data.meritReleaseDate || "December 22, 2026 at 11:00 AM IST");
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|STAGE1-PASS|SCORE-94.5`),
    createQrCodeBuffer(`https://ihubgujarat.in/merit-audit/${regId}`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawSimplePageFrame(doc, 1, 2, regId, "IHUB-SCRUT-07", "STAGE 1 TECHNICAL EVALUATION & MERIT VERDICT");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 50, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#000000").text("CENTRAL TECHNICAL SCRUTINY COMMITTEE & PEER REVIEW JURY", 45, 64, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text("National Innovation & Startup Evaluation Mission | Prajna Puram, Navrangpura, Ahmedabad 380015", 45, 77, { align: "center", width: 505 });

    doc.moveTo(45, 90).lineTo(550, 90).lineWidth(0.75).strokeColor("#000000").stroke();

    // Ref & Date
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(`SCRUTINY VERDICT REF: IHUB/EVAL-STAGE1/MERIT-SCRUTINY/2026/911`, 45, 98);
    doc.font("Helvetica").fontSize(8).fillColor("#000000").text(`DATE OF VERDICT: ${dateStr.toUpperCase()}`, 350, 98, { align: "right", width: 195 });

    // Title
    doc.font("Helvetica-Bold").fontSize(11.5).fillColor("#000000").text("OFFICIAL STAGE 1 TECHNICAL EVALUATION VERDICT & SHORTLIST CERTIFICATE", 45, 116, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#000000").text("PROJECT-BASED EVALUATION CLEARANCE - ALL-INDIA MERIT CONTENDER", 45, 131, { align: "center", width: 505 });
    doc.moveTo(60, 142).lineTo(535, 142).lineWidth(0.5).strokeColor("#000000").stroke();

    // Notice
    const sec1Top = 152;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 1: EVALUATED CANDIDATE & SUBMISSION RECORD", 45, sec1Top);
    doc.moveTo(45, sec1Top + 11).lineTo(550, sec1Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const gY = sec1Top + 16;
    const rH = 22;
    doc.rect(45, gY, 505, rH * 5).lineWidth(0.5).strokeColor("#000000").stroke();
    for (let i = 1; i < 5; i++) {
      doc.moveTo(45, gY + i * rH).lineTo(550, gY + i * rH).lineWidth(0.5).strokeColor("#000000").stroke();
    }
    doc.moveTo(270, gY).lineTo(270, gY + rH * 5).lineWidth(0.5).strokeColor("#000000").stroke();

    const eRows = [
      { l1: "EVALUATED CANDIDATE:", v1: name.toUpperCase(), l2: "REGISTRATION ID:", v2: regId, f2: "Courier-Bold" },
      { l1: "COLLEGE / INSTITUTION:", v1: college, l2: "CHALLENGE TRACK:", v2: track },
      { l1: "PROJECT TITLE:", v1: projectTitle, l2: "AUDIT VERDICT:", v2: "STAGE 1 CLEARED (RECOMMENDED)" },
      { l1: "CUMULATIVE SCORE:", v1: `${score} (Grade: Exemplary)`, l2: "MERIT PERCENTILE:", v2: rank },
      { l1: "ASSIGNED EMAIL:", v1: targetEmail, l2: "STAGE 2 DISPATCH:", v2: "Direct Email Merit Notification" },
    ];
    eRows.forEach((r, idx) => {
      const cy = gY + idx * rH;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l1, 52, cy + 6);
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(r.v1, 155, cy + 6, { width: 110, ellipsis: true });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(r.l2, 278, cy + 6);
      doc.font(r.f2 || "Helvetica").fontSize(7.5).fillColor("#000000").text(r.v2, 385, cy + 6, { width: 160, ellipsis: true });
    });

    // Barcode Block
    const barTop = gY + rH * 5 + 14;
    doc.rect(45, barTop, 505, 78).lineWidth(0.5).strokeColor("#000000").stroke();
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 42 });
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text("Official Technical Scrutiny Barcode - Certified by i-Hub Evaluation Directorate", 60, barTop + 58);
    }
    if (qrBuf) {
      doc.image(qrBuf, 410, barTop + 6, { width: 68, height: 68 });
      doc.font("Helvetica").fontSize(6.5).fillColor("#000000").text("Evaluation Audit QR", 410, barTop + 72, { align: "center", width: 68 });
    }

    // Section 2: Scorecard Rubric Table
    const scoreTop = barTop + 90;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 2: TECHNICAL ASSESSMENT RUBRIC & BENCHMARK BREAKDOWN", 45, scoreTop);
    doc.moveTo(45, scoreTop + 11).lineTo(550, scoreTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const rubricY = scoreTop + 16;
    const rubrics = [
      { crit: "1. System Architecture & Fault-Tolerance", w: "30 Marks", sc: "28.5 / 30", obs: "High-throughput microservices, robust circuit-breaker patterns, clean API interfaces" },
      { crit: "2. Algorithmic Rigor & Real-time Mitigation", w: "30 Marks", sc: "29.0 / 30", obs: "Demonstrated sub-50ms transaction anomaly detection, low false-positive rate" },
      { crit: "3. Commercial Feasibility, Moat & SaaS Model", w: "30 Marks", sc: "27.5 / 30", obs: "Strong unit economics, scalable multi-tenant SaaS schema, clear enterprise GTM" },
      { crit: "4. Code Cleanliness, Security & Test Coverage", w: "10 Marks", sc: "9.5 / 10", obs: "Zero critical CVE vulnerabilities, 92%+ test coverage, automated CI/CD pipeline" },
      { crit: "CUMULATIVE OVERALL PERFORMANCE", w: "100 Marks", sc: "94.5 / 100", obs: "FINAL RECOMMENDATION: QUALIFIED FOR CONSOLIDATED ALL-INDIA MERIT LIST" },
    ];
    doc.rect(45, rubricY, 505, rubrics.length * 20).lineWidth(0.5).strokeColor("#000000").stroke();
    rubrics.forEach((rb, idx) => {
      const ry = rubricY + idx * 20;
      if (idx > 0) doc.moveTo(45, ry).lineTo(550, ry).lineWidth(0.5).strokeColor("#000000").stroke();

      const isTot = idx === rubrics.length - 1;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(rb.crit, 52, ry + 5.5);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#000000").text(rb.sc, 255, ry + 5.5);
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text(rb.obs, 320, ry + 5.5, { width: 220, ellipsis: true });
    });

    doc.font("Helvetica").fontSize(7).fillColor("#000000").text("[TURN OVER TO PAGE 2 FOR ALL-INDIA MERIT LIST PROTOCOL & DISPATCH SCHEDULE]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawSimplePageFrame(doc, 2, 2, regId, "IHUB-SCRUT-07", "STAGE 1 TECHNICAL EVALUATION & MERIT VERDICT");

    const p2Top = 80;

    // Section 3: Merit Directive
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 3: CONSOLIDATED ALL-INDIA MERIT RANK LIST DIRECTIVE", 45, p2Top);
    doc.moveTo(45, p2Top + 11).lineTo(550, p2Top + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const merBoxY = p2Top + 16;
    doc.rect(45, merBoxY, 505, 96).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("STATUTORY NATIONAL SCRUTINY & CONSOLIDATION CLAUSE", 55, merBoxY + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text(
      `1. NATIONAL CONSOLIDATION: Having cleared Stage 1 Technical Scrutiny with 94.5/100, the candidate's project is now entered into the National All-India Innovation Ledger alongside shortlisted contenders across all participating Indian states.\n\n` +
      `2. DISPATCH TO ASSIGNED RECIPIENT EMAIL: The official, gazetted Consolidated All-India Merit Rank List, alongside Stage 2 Live VC Pitch appointment slots and technical docket links, will be dispatched DIRECTLY to your registered email address (${targetEmail}) on ${meritDate}.\n\n` +
      `3. CONFIDENTIALITY & INTEGRITY: The candidate is strictly instructed to monitor their inbox and ensure uninterrupted delivery. No second submission window will be opened for unacknowledged emails.`,
      55,
      merBoxY + 20,
      { width: 485, lineGap: 1.5 }
    );

    // Section 4: Stage 2 Prerequisites
    const preTop = merBoxY + 110;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000000").text("SECTION 4: MANDATORY STAGE 2 NATIONAL ROUND PREREQUISITES", 45, preTop);
    doc.moveTo(45, preTop + 11).lineTo(550, preTop + 11).lineWidth(0.5).strokeColor("#000000").stroke();

    const prY = preTop + 16;
    const prereqs = [
      { num: "01", t: "Live Production / Staging URL & API Credentials", d: "Provision a live staging endpoint with demo API keys for real-time load testing by the National Jury." },
      { num: "02", t: "10-Slide Institutional Investor Deck", d: "Structured slide deck covering Problem, Tech Moat, Architecture Diagram, Traction, and SaaS Revenue Model." },
      { num: "03", t: "Benchmarking & Security Vulnerability Report", d: "Attach OWASP Top 10 penetration test logs, latency profiles, and concurrent connection test data." },
      { num: "04", t: "3-Minute Video Architecture Walkthrough", d: "Loom / YouTube unlisted video explaining distributed transaction state machine and failure recovery." },
    ];
    doc.rect(45, prY, 505, prereqs.length * 21).lineWidth(0.5).strokeColor("#000000").stroke();
    prereqs.forEach((pr, idx) => {
      const pry = prY + idx * 21;
      if (idx > 0) doc.moveTo(45, pry).lineTo(550, pry).lineWidth(0.5).strokeColor("#000000").stroke();
      doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text(pr.num, 52, pry + 4.5);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#000000").text(pr.t, 75, pry + 4.5);
      doc.font("Helvetica").fontSize(7).fillColor("#000000").text(pr.d, 75, pry + 12.5, { width: 465 });
    });

    // Section 5: Signatures
    const sTop = prY + prereqs.length * 21 + 16;
    doc.rect(45, sTop, 505, 96).lineWidth(0.5).strokeColor("#000000").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("CENTRAL SCRUTINY COMMITTEE", 55, sTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("CHIEF TECHNICAL EVALUATOR", 55, sTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("National Innovation & Technical Audit Board", 55, sTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("PROJECT AUDIT CONFIRMED (GRADE A+)", 55, sTop + 48);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(`Evaluated: ${dateStr}`, 55, sTop + 62);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000").text("NATIONAL JURY CHAIR", 280, sTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#000000").text("CHAIRMAN - PEER REVIEW COUNCIL", 280, sTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#000000").text("Gujarat Student Startup and Innovation Hub (i-Hub)", 280, sTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#000000").text("ALL-INDIA MERIT DISPATCH APPROVED", 280, sTop + 48);
    doc.font("Helvetica").fontSize(7).fillColor("#000000").text(`Dispatch Target: ${targetEmail}`, 280, sTop + 62);

    doc.rect(450, sTop + 14, 85, 68).lineWidth(0.5).strokeColor("#000000").stroke();
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#000000").text("CENTRAL\nSCRUTINY BOARD\nOFFICIAL AUDIT\nEMBOSSED SEAL", 450, sTop + 26, { align: "center", width: 85 });

    doc.end();
  });
}

module.exports = {
  generateRegistrationReceiptPdf,
  generateFoodPassPdf,
  generateSecurityUndertakingPdf,
  generateParentalConsentPdf,
  generateOfficialHackerPassPdf,
  generateDelhiSaasNominationPdf,
  generateProjectStage1MeritPdf,
  generateHackathonPass: generateOfficialHackerPassPdf, // backwards compatibility
};
