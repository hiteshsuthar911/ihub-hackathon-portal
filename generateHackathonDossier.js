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
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch (err) {
    console.error("QR Code generation error:", err);
    return null;
  }
}

/**
 * Sanitize and clean HTML entities / corrupted byte artifacts
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
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "") // strip emoji / non-latin bytes
    .trim();
}

/**
 * Common double-line document frame and institutional running header/footer
 */
function drawPageFrame(doc, pageNum, totalPages, regId, docCode, title) {
  // Outer formal double border
  doc.lineWidth(1).strokeColor("#0f172a").rect(30, 30, 535, 782).stroke();
  doc.lineWidth(0.5).strokeColor("#94a3b8").rect(34, 34, 527, 774).stroke();

  // Running header (Page 2 onwards)
  if (pageNum > 1) {
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 42);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text(`${title} | REF: ${regId}`, 45, 52);
    doc.font("Courier-Bold").fontSize(7.5).fillColor("#0f172a").text(`DOC CODE: ${docCode}`, 380, 42, { align: "right", width: 170 });
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text(`Page ${pageNum} of ${totalPages}`, 380, 52, { align: "right", width: 170 });
    doc.moveTo(42, 64).lineTo(553, 64).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
  }

  // Running footer on every page
  const footY = 794;
  doc.moveTo(42, footY - 6).lineTo(553, footY - 6).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
  doc.font("Helvetica").fontSize(7).fillColor("#64748b").text(
    `Gujarat Student Startup & Innovation Hub (i-Hub) | Prajna Puram, Navrangpura, Ahmedabad 380015 | Helpline: +91 79 2630 1234`,
    45,
    footY
  );
  doc.font("Helvetica-Bold").fontSize(7).fillColor("#0f172a").text(`Page ${pageNum} of ${totalPages}`, 450, footY, { align: "right", width: 105 });
}

/**
 * ============================================================================
 * 1. OFFICIAL REGISTRATION RECEIPT & ADMISSION DOCKET (2 PAGES)
 * ============================================================================
 */
async function generateRegistrationReceiptPdf(data = {}) {
  const name = cleanText(data.participantName || "Alex Rivera");
  const regId = cleanText(data.registrationId || "IHUB-2026-9842");
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
    const doc = new PDFDocument({ margin: 30, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawPageFrame(doc, 1, 2, regId, "IHUB-ADM-RCP-01", "REGISTRATION RECEIPT & ADMISSION DOCKET");

    // Institutional Emblem Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT", 45, 48, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text("EDUCATION DEPARTMENT - GUJARAT STUDENT STARTUP AND INNOVATION HUB", 45, 62, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("KCG Campus, Opp. PRL, Prajna Puram, Navrangpura, Ahmedabad, Gujarat 380015", 45, 75, { align: "center", width: 505 });

    doc.moveTo(45, 88).lineTo(550, 88).lineWidth(1).strokeColor("#0f172a").stroke();
    doc.moveTo(45, 91).lineTo(550, 91).lineWidth(0.5).strokeColor("#94a3b8").stroke();

    // Document Meta Strip
    doc.font("Courier-Bold").fontSize(8).fillColor("#0f172a").text(`DISPATCH REF: IHUB/HACK-2026/REG/${regId}`, 45, 98);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text(`DATE OF ISSUE: ${dateStr.toUpperCase()}`, 380, 98, { align: "right", width: 170 });

    // Document Title
    doc.rect(45, 114, 505, 26).fillAndStroke("#0f172a", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#ffffff").text("OFFICIAL HACKATHON REGISTRATION RECEIPT & ADMISSION DOCKET", 45, 121, { align: "center", width: 505 });

    // Status & Event Sub-strip
    doc.rect(45, 144, 505, 22).fillAndStroke("#f1f5f9", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#059669").text("ADMISSION STATUS: PROVISIONALLY VERIFIED & SEAT ALLOCATED", 55, 150);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("EVENT: i-HUB GUJARAT INNOVATION HACKATHON 2026", 280, 150, { align: "right", width: 260 });

    // Section 1: Candidate & Registration Credentials Table
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 1: CANDIDATE ACADEMIC & ADMISSION CREDENTIALS", 45, 178);
    doc.moveTo(45, 190).lineTo(550, 190).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const gridY = 196;
    const rH = 24;
    doc.rect(45, gridY, 505, rH * 6).fillAndStroke("#ffffff", "#94a3b8");

    for (let i = 1; i < 6; i++) {
      doc.moveTo(45, gridY + i * rH).lineTo(550, gridY + i * rH).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
    }
    doc.moveTo(270, gridY).lineTo(270, gridY + rH * 6).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    const rowData = [
      { l1: "APPLICANT FULL NAME", v1: name.toUpperCase(), l2: "REGISTRATION REFERENCE ID", v2: regId, f2: "Courier-Bold" },
      { l1: "COLLEGE / INSTITUTION", v1: college, l2: "PARTICIPATION FORMAT", v2: team },
      { l1: "CHALLENGE DOMAIN / TRACK", v1: track, l2: "ASSIGNED HARDWARE BOOTH", v2: "Booth #A-14 (Cluster 2)" },
      { l1: "REGISTERED FOOD PLAN", v1: diet, l2: "ADMISSION VERIFICATION", v2: "2FA OTP Dual Authenticated" },
      { l1: "PARENT / GUARDIAN NAME", v1: parentName, l2: "PARENT EMERGENCY CONTACT", v2: parentPhone },
      { l1: "REPORTING VENUE", v1: "i-Hub Campus Main Auditorium", l2: "GRANT STATUS", v2: "Govt Sponsored (₹0.00 Tuition)" },
    ];

    rowData.forEach((row, idx) => {
      const cy = gridY + idx * rH;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text(row.l1, 52, cy + 4);
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(row.v1, 52, cy + 13, { width: 210, ellipsis: true });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text(row.l2, 278, cy + 4);
      doc.font(row.f2 || "Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(row.v2, 278, cy + 13, { width: 260, ellipsis: true });
    });

    // Barcode & QR Block
    const barTop = gridY + rH * 6 + 14;
    doc.rect(45, barTop, 505, 96).fillAndStroke("#f8fafc", "#cbd5e1");

    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 14, { width: 260, height: 48 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Official Admissions Barcode (Scan at Registration Gate A)", 60, barTop + 70);
    }

    if (qrBuf) {
      doc.image(qrBuf, 395, barTop + 8, { width: 80, height: 80 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Scan to Validate", 395, barTop + 84, { align: "center", width: 80 });
    }

    // Section 2: Financial Exemption & Sponsorship Schedule
    const grantY = barTop + 110;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 2: SPONSORSHIP, STIPEND & INFRASTRUCTURE ENTITLEMENTS", 45, grantY);
    doc.moveTo(45, grantY + 12).lineTo(550, grantY + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const grantBoxY = grantY + 18;
    doc.rect(45, grantBoxY, 505, 76).fillAndStroke("#ffffff", "#e2e8f0");
    const grants = [
      { item: "Tuition & Delegate Entry Fee", val: "100% Waived (Full State Government Scholarship)", status: "COMPLIMENTARY" },
      { item: "High-Speed Gigabit LAN & Cloud Cluster", val: "500 Mbps Dedicated Dual-Fiber + $500 Cloud Sandbox Credits", status: "PROVISIONED" },
      { item: "Full 27.5-Hour Catering & Hospitality", val: "7 Full Meals + Midnight Refreshment Stations (Dining Pass Attached)", status: "INCLUDED" },
      { item: "Makerspace & IoT Hardware Access", val: "i-Hub FabLab 3D Printers, Oscilloscopes & Microcontroller Kits", status: "AVAILABLE" },
    ];

    grants.forEach((g, idx) => {
      const gy = grantBoxY + idx * 19;
      if (idx > 0) doc.moveTo(45, gy).lineTo(550, gy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#334155").text(g.item, 55, gy + 5);
      doc.font("Helvetica").fontSize(8).fillColor("#64748b").text(g.val, 200, gy + 5, { width: 230 });
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#059669").text(g.status, 440, gy + 5, { align: "right", width: 95 });
    });

    // Section 3: Essential Reporting Summary Notice
    const notY = grantBoxY + 90;
    doc.rect(45, notY, 505, 68).fillAndStroke("#fcfcfd", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("MANDATORY CANDIDATE REPORTING NOTICE", 55, notY + 8);
    doc.font("Helvetica").fontSize(8).fillColor("#1e293b").text(
      "All registered innovators must present themselves in person at the i-Hub Ahmedabad Reception on Friday, December 15, 2026 between 08:30 AM and 09:30 AM IST. Turn over to Page 2 for the exhaustive mandatory verification checklist, round progression milestones, and control room directory.",
      55,
      notY + 22,
      { width: 485, lineGap: 2.5 }
    );
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text("[CONTINUED ON PAGE 2 OF 2 - PLEASE TURN OVER]", 45, notY + 54, { align: "right", width: 495 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawPageFrame(doc, 2, 2, regId, "IHUB-ADM-RCP-01", "REGISTRATION RECEIPT & ADMISSION DOCKET");

    const p2Top = 80;

    // Section 4: Mandatory Document & Entry Checklist
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 3: MANDATORY DESK VERIFICATION CHECKLIST", 45, p2Top);
    doc.moveTo(45, p2Top + 12).lineTo(550, p2Top + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const chkY = p2Top + 18;
    doc.rect(45, chkY, 505, 84).fillAndStroke("#ffffff", "#cbd5e1");

    const checklist = [
      { box: "[  ]", title: "Original Government Photo Identity", desc: "Physical Aadhaar Card, Voter ID, Driver License or Indian Passport for biometric cross-match." },
      { box: "[  ]", title: "Valid College / Institutional Identity Card", desc: "Original college student card or Dean-signed bonafide enrollment letter." },
      { box: "[  ]", title: "Signed Security & Anti-Exit Undertaking", desc: "Printed & physically counter-signed copy of Attachment 3 (Anti-Exit Protocol)." },
      { box: "[  ]", title: "Parental Overnight Consent Document", desc: "Attachment 4 signed by parent/guardian with verifiable emergency mobile number." },
      { box: "[  ]", title: "Hardware Inward Pass Declaration", desc: "Serial numbers of laptop, power adaptors, and external microcontrollers logged for inward security tag." },
    ];

    checklist.forEach((item, idx) => {
      const iy = chkY + idx * 16.5;
      if (idx > 0) doc.moveTo(45, iy).lineTo(550, iy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(item.box, 52, iy + 3.5);
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text(item.title + ":", 75, iy + 3.5);
      doc.font("Helvetica").fontSize(8).fillColor("#475569").text(item.desc, 235, iy + 3.5, { width: 305 });
    });

    // Section 5: Hackathon 4-Stage Round Timeline & Milestone Framework
    const timeTop = chkY + 100;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 4: 27.5-HOUR ROUND TIMELINE & EVALUATION MILESTONES", 45, timeTop);
    doc.moveTo(45, timeTop + 12).lineTo(550, timeTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const timeY = timeTop + 18;
    const timeRows = [
      { time: "Dec 15 | 09:00 AM - 11:00 AM", stage: "Round 1", task: "Physical Check-in, Badge Printing, Kit Distribution & Inaugural Keynote" },
      { time: "Dec 15 | 11:00 AM SHARP", stage: "Commencement", task: "27.5-HOUR CONTINUOUS HACKING SPRINT OFFICIALLY BEGINS" },
      { time: "Dec 15 | 04:00 PM - 07:00 PM", stage: "Round 2", task: "Milestone 1: Architectural Validation, Problem Mapping & Tech Stack Review" },
      { time: "Dec 15 | 08:30 PM - 10:00 PM", stage: "Checkpoint", task: "Dinner Buffet & Progress Checkpoint Sign-off by Domain Mentors" },
      { time: "Dec 16 | 01:30 AM - 04:30 AM", stage: "Round 3", task: "Midnight Screening & Jury Pitch: Bottom 25% Elimination Cut Enforced" },
      { time: "Dec 16 | 09:30 AM SHARP", stage: "Code Freeze", task: "Devpost Repository Commit Lock: Late submissions immediately rejected" },
      { time: "Dec 16 | 10:30 AM - 12:30 PM", stage: "Round 4", task: "Grand Finale Live Stage Demos before VC Jury, Valedictory & Awards" },
    ];

    doc.rect(45, timeY, 505, timeRows.length * 20.5).fillAndStroke("#ffffff", "#94a3b8");
    timeRows.forEach((r, idx) => {
      const ty = timeY + idx * 20.5;
      if (idx > 0) doc.moveTo(45, ty).lineTo(550, ty).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
      if (idx % 2 === 1) doc.rect(45, ty, 505, 20.5).fill("#f8fafc");

      doc.font("Courier-Bold").fontSize(7.5).fillColor("#0f172a").text(r.time, 52, ty + 5.5);
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#4f46e5").text(r.stage, 220, ty + 5.5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#334155").text(r.task, 290, ty + 5.5, { width: 250 });
    });

    // Section 6: Emergency & Administrative Contacts
    const dirTop = timeY + timeRows.length * 20.5 + 16;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 5: CONTROL ROOM & EMERGENCY RESPONSE DIRECTORY", 45, dirTop);
    doc.moveTo(45, dirTop + 12).lineTo(550, dirTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const dirY = dirTop + 18;
    doc.rect(45, dirY, 505, 52).fillAndStroke("#ffffff", "#cbd5e1");

    const contacts = [
      { unit: "Central Helpdesk", loc: "Ground Floor Atrium", phone: "+91 79 2630 1234", email: "hackathon@ihubgujarat.in" },
      { unit: "Medical Cell & Ambulance", loc: "Room 104 (Health Post)", phone: "+91 98250 11223", email: "medical@ihubgujarat.in" },
      { unit: "Proctorial Security", loc: "Main Security Gate A", phone: "+91 97123 44556", email: "security@ihubgujarat.in" },
    ];

    contacts.forEach((c, idx) => {
      const cy = dirY + idx * 17;
      if (idx > 0) doc.moveTo(45, cy).lineTo(550, cy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(c.unit, 52, cy + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(c.loc, 175, cy + 4);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#0f172a").text(c.phone, 305, cy + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#4f46e5").text(c.email, 420, cy + 4);
    });

    // Section 7: Signatures & Certification Block
    const signTop = dirY + 70;
    doc.rect(45, signTop, 505, 96).fillAndStroke("#f8fafc", "#94a3b8");

    // Candidate declaration side
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("CANDIDATE SOLEMN UNDERTAKING", 55, signTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#334155").text(
      "I confirm that all particulars provided herein are authentic. I agree to abide by all i-Hub regulations and campus disciplinary rules.",
      55,
      signTop + 20,
      { width: 220, lineGap: 1.5 }
    );
    doc.moveTo(55, signTop + 72).lineTo(235, signTop + 72).lineWidth(0.5).strokeColor("#475569").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text("Signature of Candidate / Innovator", 55, signTop + 76);

    // Official Authority side
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("ADMISSIONS & SCRUTINY COMMITTEE", 300, signTop + 8);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text("GUJARAT STUDENT STARTUP & INNOVATION HUB", 300, signTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Prajna Puram, Navrangpura, Ahmedabad 380015", 300, signTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#059669").text("DIGITALLY VALIDATED & OFFICIALLY ISSUED", 300, signTop + 48);

    doc.rect(450, signTop + 14, 85, 68).strokeColor("#94a3b8").lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor("#94a3b8").text("OFFICIAL STAMP\n& SEAL\nAT ENTRY", 450, signTop + 32, { align: "center", width: 85 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 2. COMPREHENSIVE FOOD & HOSPITALITY CATERING PASS (2 PAGES)
 * ============================================================================
 */
async function generateFoodPassPdf(data = {}) {
  const name = cleanText(data.participantName || "Alex Rivera");
  const regId = cleanText(data.registrationId || "IHUB-2026-9842");
  const diet = cleanText(data.foodPreference || "Pure Vegetarian");
  const team = cleanText(data.teamName || "Solo Innovator");
  const passId = `FP-${regId.replace("IHUB-", "")}`;

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|FOOD|${diet.substring(0, 3).toUpperCase()}`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?doc=foodpass`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawPageFrame(doc, 1, 2, regId, "IHUB-HOSP-FP-02", "OFFICIAL FOOD & CATERING COUPON PASS");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 48, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text("HOSPITALITY, CATERING & DELEGATE WELFARE CELL", 45, 62, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Annual Innovation Hackathon 2026 | Prajna Puram, Navrangpura, Ahmedabad 380015", 45, 75, { align: "center", width: 505 });

    doc.moveTo(45, 88).lineTo(550, 88).lineWidth(1).strokeColor("#0f172a").stroke();
    doc.moveTo(45, 91).lineTo(550, 91).lineWidth(0.5).strokeColor("#94a3b8").stroke();

    // Pass Title
    doc.rect(45, 102, 505, 26).fillAndStroke("#065f46", "#065f46");
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#ffffff").text("ALL-INCLUSIVE 27.5-HOUR MEAL & HOSPITALITY PASS", 45, 109, { align: "center", width: 505 });

    // Identity Strip
    doc.rect(45, 134, 505, 54).fillAndStroke("#f0fdf4", "#86efac");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#166534").text("REGISTERED PARTICIPANT", 55, 140);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#0f172a").text(name.toUpperCase(), 55, 150);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text(`Squad: ${team}`, 55, 168);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#166534").text("CATERING PASS ID", 250, 140);
    doc.font("Courier-Bold").fontSize(11).fillColor("#0f172a").text(passId, 250, 151);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text(`Reg Ref: ${regId}`, 250, 168);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#166534").text("DIETARY ALLOCATION", 400, 140);
    doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#047857").text(diet.toUpperCase(), 400, 151);
    doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text("Jain & Swaminarayan segregated", 400, 168);

    // Barcode Scanner Box
    const bTop = 196;
    doc.rect(45, bTop, 505, 78).fillAndStroke("#ffffff", "#cbd5e1");
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, bTop + 10, { width: 280, height: 44 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Scan at Cafeteria Entry Terminal prior to meal collection", 60, bTop + 60);
    }
    if (qrBuf) {
      doc.image(qrBuf, 400, bTop + 6, { width: 66, height: 66 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Dining Token QR", 400, bTop + 68, { align: "center", width: 66 });
    }

    // Section 1: Detailed 7-Meal Timetable
    const mealTop = bTop + 90;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 1: OFFICIAL 27.5-HOUR CATERING & MEAL TIMETABLE", 45, mealTop);
    doc.moveTo(45, mealTop + 12).lineTo(550, mealTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const meals = [
      { id: "M-01", meal: "Welcome Breakfast & Tea", window: "Dec 15 | 08:30 AM - 10:00 AM", loc: "Dining Hall A", menu: "Gujarati Poha, Upma, Idli Sambhar, Fresh Chutneys, Tea & Coffee" },
      { id: "M-02", meal: "Executive Grand Lunch Buffet", window: "Dec 15 | 01:00 PM - 02:30 PM", loc: "Central Dining Pavilion", menu: "Paneer Lababdar, Gujarati Kadhi, Khichdi, Phulka Roti, Salad & Gulab Jamun" },
      { id: "M-03", meal: "High Tea & Evening Snacks", window: "Dec 15 | 05:00 PM - 06:00 PM", loc: "Atrium Refreshment Deck", menu: "Khaman Dhokla, Samosa with Mint Dip, Cookies & Masala Chai" },
      { id: "M-04", meal: "Dinner Buffet & Progress Fuel", window: "Dec 15 | 08:30 PM - 10:00 PM", loc: "Central Dining Pavilion", menu: "Dal Makhani, Mix Veg Curry, Jeera Rice, Tandoori Roti & Shrikhand" },
      { id: "M-05", meal: "Midnight Energy Boost & Pizza", window: "Dec 16 | 01:30 AM - 02:30 AM", loc: "Tech Lounge Atrium", menu: "Fresh Wood-fired Margherita Pizza, Energy Drinks, Espresso & Cookies" },
      { id: "M-06", meal: "Day 2 Power Breakfast", window: "Dec 16 | 07:30 AM - 09:00 AM", loc: "Dining Hall A", menu: "Methi Thepla, Batata Poha, Sweet Curd, Fresh Fruits, Tea & Coffee" },
      { id: "M-07", meal: "Finale Celebration Lunch", window: "Dec 16 | 12:30 PM - 02:00 PM", loc: "Main Banquet Hall", menu: "Royal Gujarati Thali with Puri, Farsan, Dal Baati Churma & Ice Cream" },
    ];

    const mealTableY = mealTop + 18;
    const mRowH = 34;
    doc.rect(45, mealTableY, 505, meals.length * mRowH).fillAndStroke("#ffffff", "#94a3b8");

    meals.forEach((m, idx) => {
      const my = mealTableY + idx * mRowH;
      if (idx > 0) doc.moveTo(45, my).lineTo(550, my).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
      if (idx % 2 === 1) doc.rect(45, my, 505, mRowH).fill("#f8fafc");

      doc.font("Courier-Bold").fontSize(8).fillColor("#047857").text(m.id, 52, my + 6);
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(m.meal, 85, my + 6);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#475569").text(m.window, 345, my + 6, { align: "right", width: 195 });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text(`Venue: ${m.loc} | Menu:`, 85, my + 19);
      doc.font("Helvetica").fontSize(7.5).fillColor("#334155").text(m.menu, 205, my + 19, { width: 335, ellipsis: true });
    });

    // Page 1 footer hint
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text("[TURN OVER TO PAGE 2 FOR PHYSICAL VOUCHER STAMP GRID & HYGIENE RULES]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawPageFrame(doc, 2, 2, regId, "IHUB-HOSP-FP-02", "OFFICIAL FOOD & CATERING COUPON PASS");

    const p2Top = 80;

    // Section 2: Special Dietary Segregation Guidelines
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 2: DIETARY INTEGRITY & ALLERGEN PROTOCOLS", 45, p2Top);
    doc.moveTo(45, p2Top + 12).lineTo(550, p2Top + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const dietY = p2Top + 18;
    doc.rect(45, dietY, 505, 70).fillAndStroke("#ffffff", "#cbd5e1");
    const dietRules = [
      { t: "Strict Jain Dietary Standards:", d: "Dedicated counters with zero onion, garlic, or root vegetable ingredients prepared in segregated kitchens." },
      { t: "Swaminarayan & Satvik Preparation:", d: "Strict satvik cooking adhering to religious purity standards with dedicated serving personnel." },
      { t: "Allergen Disclosures:", d: "Dairy, gluten, and nut warnings are clearly labeled on every buffet station. Contact hospitality desk for intolerances." },
      { t: "Continuous Hydration & Beverage Stations:", d: "Purified RO water dispensers, tea, coffee, and energy drinks operate 24 hours non-stop." },
    ];
    dietRules.forEach((r, idx) => {
      const dy = dietY + idx * 17;
      if (idx > 0) doc.moveTo(45, dy).lineTo(550, dy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text(r.t, 52, dy + 4);
      doc.font("Helvetica").fontSize(8).fillColor("#475569").text(r.d, 195, dy + 4, { width: 345 });
    });

    // Section 3: Physical Meal Verification Stamp Grid
    const stTop = dietY + 84;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 3: PHYSICAL MEAL VOUCHER & STAMP VALIDATION MATRIX", 45, stTop);
    doc.moveTo(45, stTop + 12).lineTo(550, stTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const stY = stTop + 18;
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

      doc.rect(bx, by, boxW, boxH).fillAndStroke("#ffffff", "#94a3b8");
      doc.rect(bx, by, boxW, 16).fill("#f1f5f9");
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#047857").text(v.code, bx + 4, by + 4);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(v.meal, bx + 30, by + 4, { width: boxW - 34, ellipsis: true });

      doc.font("Helvetica").fontSize(6.5).fillColor("#64748b").text(v.date, bx + 4, by + 20, { align: "center", width: boxW - 8 });
      doc.rect(bx + 12, by + 32, boxW - 24, 28).strokeColor("#cbd5e1").lineWidth(0.5).stroke();
      doc.font("Helvetica").fontSize(6).fillColor("#94a3b8").text("CATERING\nOFFICER STAMP", bx + 12, by + 39, { align: "center", width: boxW - 24 });
    });

    // Section 4: Zero Food Waste & Campus Ecology Charter
    const ecoTop = stY + 2 * (boxH + gapY) + 12;
    doc.rect(45, ecoTop, 505, 52).fillAndStroke("#fcfcfd", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("ZERO-WASTE & CLEAN CAMPUS DIRECTIVE", 55, ecoTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#1e293b").text(
      "i-Hub operates an eco-conscious zero-waste campus. All meal packaging is 100% biodegradable and compostable. Innovators must segregate dry and wet waste at all designated disposal stations. Food wastage is strictly monitored by student welfare proctors.",
      55,
      ecoTop + 20,
      { width: 485, lineGap: 1.5 }
    );

    // Section 5: Authorized Caterer Validation
    const signTop = ecoTop + 64;
    doc.rect(45, signTop, 505, 82).fillAndStroke("#f8fafc", "#94a3b8");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("HOSPITALITY & CATERING IN-CHARGE", 55, signTop + 8);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text("CHEF EXECUTIVE & CATERING OFFICER", 55, signTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("State Hospitality Division, i-Hub Ahmedabad", 55, signTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#059669").text("OFFICIALLY ENDORSED MEAL COUPON", 55, signTop + 48);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("PARTICIPANT ACKNOWLEDGEMENT", 300, signTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#334155").text(`Name: ${name.toUpperCase()} (ID: ${regId})`, 300, signTop + 20);
    doc.moveTo(300, signTop + 58).lineTo(500, signTop + 58).lineWidth(0.5).strokeColor("#475569").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text("Signature of Participant upon Receiving Kit", 300, signTop + 62);

    doc.end();
  });
}

/**
 * ============================================================================
 * 3. SECURITY, DISCIPLINARY & ANTI-EXIT STATUTORY UNDERTAKING (2 PAGES)
 * ============================================================================
 */
async function generateSecurityUndertakingPdf(data = {}) {
  const name = cleanText(data.participantName || "Alex Rivera");
  const regId = cleanText(data.registrationId || "IHUB-2026-9842");
  const team = cleanText(data.teamName || "Solo Innovator");
  const track = cleanText(data.track || "FinTech & Next-Gen Digital Payments");
  const college = cleanText(data.college || "Thakur College of Engineering and Technology");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|SEC|STRICT-NO-EXIT`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?doc=security`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawPageFrame(doc, 1, 2, regId, "IHUB-SEC-AGR-03", "SECURITY UNDERTAKING & ANTI-EXIT PROTOCOL");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 48, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text("PROCTORIAL BOARD & CAMPUS CHIEF SECURITY COMMAND", 45, 62, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015 | Control Room: +91 79 2630 1234", 45, 75, { align: "center", width: 505 });

    doc.moveTo(45, 88).lineTo(550, 88).lineWidth(1).strokeColor("#0f172a").stroke();
    doc.moveTo(45, 91).lineTo(550, 91).lineWidth(0.5).strokeColor("#94a3b8").stroke();

    // Document Title
    doc.rect(45, 102, 505, 26).fillAndStroke("#991b1b", "#991b1b");
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#ffffff").text("STATUTORY ANTI-EXIT AGREEMENT, CAMPUS SECURITY & HARDWARE GATE PASS", 45, 109, { align: "center", width: 505 });

    // Warning Banner
    doc.rect(45, 134, 505, 34).fillAndStroke("#fef2f2", "#fca5a5");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#991b1b").text("LEGAL PROCTORIAL INSTRUMENT - BINDING ON ALL 36-HOUR RESIDENTS", 55, 140);
    doc.font("Helvetica").fontSize(7.5).fillColor("#7f1d1d").text(
      "This undertaking is executed pursuant to Gujarat Innovation Hub Security Directives. Continuous 27.5-hour campus residence is mandatory. Zero tolerance is strictly maintained for unauthorized perimeter violations.",
      55,
      151,
      { width: 485 }
    );

    // Section 1: Candidate Particulars Table
    const sec1Y = 178;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 1: CANDIDATE IDENTIFICATION & ACCESS RECORD", 45, sec1Y);
    doc.moveTo(45, sec1Y + 12).lineTo(550, sec1Y + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const tY = sec1Y + 18;
    doc.rect(45, tY, 505, 52).fillAndStroke("#ffffff", "#cbd5e1");
    doc.moveTo(45, tY + 26).lineTo(550, tY + 26).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
    doc.moveTo(270, tY).lineTo(270, tY + 52).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text("CANDIDATE FULL NAME", 52, tY + 4);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(name.toUpperCase(), 52, tY + 14);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text("SECURITY REGISTRATION ID", 278, tY + 4);
    doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(regId, 278, tY + 14);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text("INSTITUTION / COLLEGE", 52, tY + 30);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text(college, 52, tY + 40, { width: 210, ellipsis: true });

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text("SQUAD / TRACK ALLOCATION", 278, tY + 30);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text(`${team} | ${track}`, 278, tY + 40, { width: 260, ellipsis: true });

    // Barcode Block
    const barTop = tY + 62;
    doc.rect(45, barTop, 505, 78).fillAndStroke("#f8fafc", "#cbd5e1");
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 44 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Proctorial Scanner Token - Validated at Perimeter Gate 1 & 2", 60, barTop + 60);
    }
    if (qrBuf) {
      doc.image(qrBuf, 400, barTop + 6, { width: 66, height: 66 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Gate Security QR", 400, barTop + 68, { align: "center", width: 66 });
    }

    // Section 2: Statutory Anti-Exit Clause & Disqualification Statute
    const lawTop = barTop + 90;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#991b1b").text("SECTION 2: ARTICLE I - STATUTORY ZERO-TOLERANCE ANTI-EXIT CLAUSE", 45, lawTop);
    doc.moveTo(45, lawTop + 12).lineTo(550, lawTop + 12).lineWidth(0.5).strokeColor("#991b1b").stroke();

    const lawBoxY = lawTop + 18;
    doc.rect(45, lawBoxY, 505, 114).fillAndStroke("#ffffff", "#fca5a5");

    const articles = [
      { num: "1.1", text: "CONTINUOUS ON-CAMPUS CONFINEMENT: From official commencement (Dec 15, 11:00 AM) to formal valedictory (Dec 16, 12:30 PM), all candidates must continuously remain within designated i-Hub academic zones." },
      { num: "1.2", text: "STRICT PERIMETER VIOLATION PENALTY: Stepping outside campus perimeter gates without authorized counter-signed security pass from the Chief Proctor results in IMMEDIATE PERMANENT DISQUALIFICATION of the candidate and their entire squad." },
      { num: "1.3", text: "FORFEITURE & INSTITUTIONAL NOTICE: In the event of unauthorized exit, all cash awards, incubation grants, certificates, and travel stipends are irrevocably forfeited, and a formal disciplinary report is dispatched to the candidate's Dean/Principal." },
      { num: "1.4", text: "ROUND 3 MIDNIGHT ELIMINATION CUT: Teams failing to pass the Round 3 Midnight Jury screening (01:30 AM - 04:30 AM) remain in supervised rest lounges until 06:00 AM before scheduled exit." },
    ];

    articles.forEach((art, idx) => {
      const ay = lawBoxY + idx * 28;
      if (idx > 0) doc.moveTo(45, ay).lineTo(550, ay).lineWidth(0.5).strokeColor("#fee2e2").stroke();
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#991b1b").text(art.num, 52, ay + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#1e293b").text(art.text, 72, ay + 4, { width: 468, lineGap: 1.2 });
    });

    // Section 3: Hardware Inward Declaration Table
    const hwTop = lawBoxY + 126;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 3: HARDWARE & EQUIPMENT INWARD GATE PASS DECLARATION", 45, hwTop);
    doc.moveTo(45, hwTop + 12).lineTo(550, hwTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const hwY = hwTop + 18;
    const hwItems = [
      { item: "Primary Laptop & Power Adapter", model: "Authorized for Coding Lab", serial: "VERIFIED AT ENTRY", tag: "GATE-PASS-IN" },
      { item: "Microcontrollers / IoT Development Boards", model: "Raspberry Pi / Arduino / ESP32", serial: "LOGGED IN LAB LOG", tag: "PERMITTED" },
      { item: "Smartphones & Mobile Testing Devices", model: "Camera & Sensor Enabled", serial: "PERSONAL USE", tag: "PERMITTED" },
      { item: "High-Draw Appliances (Heaters, Kettles)", model: "RESTRICTED HAZARD", serial: "STRICTLY PROHIBITED", tag: "CONFISCATED" },
    ];

    doc.rect(45, hwY, 505, hwItems.length * 19).fillAndStroke("#ffffff", "#cbd5e1");
    hwItems.forEach((h, idx) => {
      const hy = hwY + idx * 19;
      if (idx > 0) doc.moveTo(45, hy).lineTo(550, hy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(h.item, 52, hy + 5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(h.model, 210, hy + 5);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#0f172a").text(h.serial, 370, hy + 5);
      doc.font("Helvetica-Bold").fontSize(7).fillColor(h.tag === "CONFISCATED" ? "#dc2626" : "#059669").text(h.tag, 470, hy + 5, { align: "right", width: 70 });
    });

    // Hint
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text("[TURN OVER TO PAGE 2 FOR CYBER INTEGRITY, MEDICAL SAFETY & SIGN-OFF]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawPageFrame(doc, 2, 2, regId, "IHUB-SEC-AGR-03", "SECURITY UNDERTAKING & ANTI-EXIT PROTOCOL");

    const p2Top = 80;

    // Section 4: Cyber-Security & IP Policy
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 4: CYBER CONDUCT, NETWORK INTEGRITY & INTELLECTUAL PROPERTY", 45, p2Top);
    doc.moveTo(45, p2Top + 12).lineTo(550, p2Top + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const netY = p2Top + 18;
    doc.rect(45, netY, 505, 84).fillAndStroke("#ffffff", "#cbd5e1");

    const netRules = [
      { t: "Campus Network Honor Code:", d: "Strict ban on ARP spoofing, packet sniffing, unauthorized port scanning, or intrusive penetration against peer devices or venue network." },
      { t: "Originality & Plagiarism Statute:", d: "All code must be authored afresh during the official 27.5-hour period. Open-source libraries must be declared in repo README." },
      { t: "Substance & Behavioral Zero-Tolerance:", d: "Possession or consumption of alcohol, narcotics, smoking devices, or contraband is strictly banned under Gujarat state laws." },
      { t: "Intellectual Property Ownership:", d: "Innovators retain 100% intellectual property ownership of their source code, patents, and prototypes developed at i-Hub." },
    ];

    netRules.forEach((r, idx) => {
      const ny = netY + idx * 21;
      if (idx > 0) doc.moveTo(45, ny).lineTo(550, ny).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(r.t, 52, ny + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(r.d, 195, ny + 4, { width: 345, lineGap: 1.2 });
    });

    // Section 5: Medical Fitness & Emergency Response Protocols
    const medTop = netY + 98;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 5: MEDICAL DISCLOSURE, FIRST AID & EMERGENCY RESPONSE", 45, medTop);
    doc.moveTo(45, medTop + 12).lineTo(550, medTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const medY = medTop + 18;
    doc.rect(45, medY, 505, 78).fillAndStroke("#ffffff", "#cbd5e1");

    const medPoints = [
      { q: "Pre-existing Medical Conditions / Allergies:", a: "None declared (Fit for intensive 27.5-hour innovation sprint)." },
      { q: "On-site 24x7 Medical Station:", a: "Room 104, Ground Floor (Doctor on duty, paramedic and basic trauma life support)." },
      { q: "Designated Emergency Trauma Hospital:", a: "Civil Hospital Ahmedabad / Sterling Hospital (Dedicated emergency ambulance on campus)." },
      { q: "Campus Emergency Helpline:", a: "+91 98250 11223 (Medical Officer) | +91 79 2630 1234 (Command Center)" },
    ];

    medPoints.forEach((p, idx) => {
      const py = medY + idx * 19.5;
      if (idx > 0) doc.moveTo(45, py).lineTo(550, py).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#334155").text(p.q, 52, py + 5);
      doc.font("Helvetica").fontSize(8).fillColor("#0f172a").text(p.a, 245, py + 5, { width: 295 });
    });

    // Section 6: Three-Tier Sign-Off Section
    const signTop = medY + 96;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 6: TRIPARTITE LEGAL AFFIRMATION & ENDORSEMENT", 45, signTop);
    doc.moveTo(45, signTop + 12).lineTo(550, signTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const sY = signTop + 18;
    doc.rect(45, sY, 505, 126).fillAndStroke("#f8fafc", "#94a3b8");

    // Tier 1: Candidate
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("1. CANDIDATE SOLEMN UNDERTAKING", 55, sY + 8);
    doc.font("Helvetica").fontSize(7).fillColor("#334155").text(
      "I solemnly swear that I have meticulously read the anti-exit regulations. I accept that exiting campus without permission causes instant disqualification.",
      55,
      sY + 18,
      { width: 220, lineGap: 1 }
    );
    doc.moveTo(55, sY + 54).lineTo(235, sY + 54).lineWidth(0.5).strokeColor("#475569").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(`Signature: ${name.toUpperCase()}`, 55, sY + 58);

    // Tier 2: Parent/Guardian
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("2. PARENTAL / GUARDIAN AFFIRMATION", 285, sY + 8);
    doc.font("Helvetica").fontSize(7).fillColor("#334155").text(
      "I have permitted my ward to participate in this overnight hackathon and accept all proctorial supervision policies of i-Hub Gujarat.",
      285,
      sY + 18,
      { width: 240, lineGap: 1 }
    );
    doc.moveTo(285, sY + 54).lineTo(480, sY + 54).lineWidth(0.5).strokeColor("#475569").stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text("Signature / OTP 2FA Verified by Parent", 285, sY + 58);

    // Tier 3: Chief Proctor
    doc.moveTo(45, sY + 74).lineTo(550, sY + 74).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("3. CHIEF PROCTOR & CAMPUS SECURITY WARDEN ENDORSEMENT", 55, sY + 80);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("OFFICE OF THE CHIEF SECURITY OFFICER - i-HUB AHMEDABAD", 55, sY + 92);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Prajna Puram, Navrangpura, Ahmedabad 380015 | Seal & Security Sign-off", 55, sY + 104);

    doc.rect(430, sY + 78, 105, 42).strokeColor("#94a3b8").lineWidth(0.5).stroke();
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor("#059669").text("CAMPUS SECURITY GATE\nCHECK-IN CLEARED\nINWARD PERMIT", 430, sY + 86, { align: "center", width: 105 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 4. PARENTAL & GUARDIAN OVERNIGHT PARTICIPATION CONSENT FORM (2 PAGES)
 * ============================================================================
 */
async function generateParentalConsentPdf(data = {}) {
  const name = cleanText(data.participantName || "Alex Rivera");
  const regId = cleanText(data.registrationId || "IHUB-2026-9842");
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
    const doc = new PDFDocument({ margin: 30, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawPageFrame(doc, 1, 2, regId, "IHUB-PAR-CON-04", "PARENTAL OVERNIGHT PARTICIPATION CONSENT");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 48, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text("STUDENT WELFARE & PARENTAL LIAISON DIVISION", 45, 62, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("KCG Campus, Opp. PRL, Navrangpura, Ahmedabad 380015 | Student Welfare Desk", 45, 75, { align: "center", width: 505 });

    doc.moveTo(45, 88).lineTo(550, 88).lineWidth(1).strokeColor("#0f172a").stroke();
    doc.moveTo(45, 91).lineTo(550, 91).lineWidth(0.5).strokeColor("#94a3b8").stroke();

    // Document Title
    doc.rect(45, 102, 505, 26).fillAndStroke("#1e3a8a", "#1e3a8a");
    doc.font("Helvetica-Bold").fontSize(11.5).fillColor("#ffffff").text("FORMAL PARENTAL / GUARDIAN OVERNIGHT CONSENT & MEDICAL APPROVAL", 45, 109, { align: "center", width: 505 });

    // Official Memo Notice
    doc.rect(45, 134, 505, 42).fillAndStroke("#eff6ff", "#bfdbfe");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#1e40af").text("FORMAL DISPATCH TO PARENT / LEGAL GUARDIAN", 55, 140);
    doc.font("Helvetica").fontSize(7.5).fillColor("#1e3a8a").text(
      `Dear ${parentName}, this document records your official consent for your son/daughter/ward, ${name}, to participate in the overnight 27.5-hour i-Hub Gujarat Innovation Hackathon 2026. Please inspect the event scope, residential security guarantees, and emergency contacts below.`,
      55,
      151,
      { width: 485, lineGap: 1.5 }
    );

    // Section 1: Candidate & Parent Information Matrix
    const sec1Top = 186;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 1: PARTICIPANT & PARENT IDENTITY REGISTRATION", 45, sec1Top);
    doc.moveTo(45, sec1Top + 12).lineTo(550, sec1Top + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const tY = sec1Top + 18;
    const rH = 24;
    doc.rect(45, tY, 505, rH * 5).fillAndStroke("#ffffff", "#94a3b8");

    for (let i = 1; i < 5; i++) {
      doc.moveTo(45, tY + i * rH).lineTo(550, tY + i * rH).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
    }
    doc.moveTo(270, tY).lineTo(270, tY + rH * 5).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    const pRows = [
      { l1: "STUDENT / CANDIDATE NAME", v1: name.toUpperCase(), l2: "REGISTRATION REFERENCE", v2: regId },
      { l1: "COLLEGE / INSTITUTION", v1: college, l2: "STUDENT STATUS", v2: "Regular Bonafide Student" },
      { l1: "PARENT / GUARDIAN FULL NAME", v1: parentName, l2: "RELATIONSHIP TO APPLICANT", v2: "Parent / Legal Guardian" },
      { l1: "PRIMARY EMERGENCY CONTACT", v1: parentPhone, l2: "PARENT REGISTERED EMAIL", v2: parentEmail },
      { l1: "OVERNIGHT RESIDENTIAL CAMPUS", v1: "i-Hub Campus, Ahmedabad", l2: "CONSENT VERIFICATION STATUS", v2: "Dual-OTP 2FA Authenticated" },
    ];

    pRows.forEach((r, idx) => {
      const cy = tY + idx * rH;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text(r.l1, 52, cy + 4);
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(r.v1, 52, cy + 13, { width: 210, ellipsis: true });

      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#64748b").text(r.l2, 278, cy + 4);
      doc.font(idx === 0 ? "Courier-Bold" : "Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(r.v2, 278, cy + 13, { width: 260, ellipsis: true });
    });

    // Barcode & QR Block
    const barTop = tY + rH * 5 + 14;
    doc.rect(45, barTop, 505, 80).fillAndStroke("#f8fafc", "#cbd5e1");
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 10, { width: 280, height: 44 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Parental Approval Security Hash (Logged in Admissions Audit Vault)", 60, barTop + 60);
    }
    if (qrBuf) {
      doc.image(qrBuf, 400, barTop + 6, { width: 66, height: 66 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Parent Audit QR", 400, barTop + 68, { align: "center", width: 66 });
    }

    // Section 2: Hackathon Operational Schedule & Reporting Hours
    const schTop = barTop + 94;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 2: EVENT SCOPE, RESIDENTIAL SCHEDULE & VENUE TIMINGS", 45, schTop);
    doc.moveTo(45, schTop + 12).lineTo(550, schTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const schBoxY = schTop + 18;
    doc.rect(45, schBoxY, 505, 84).fillAndStroke("#ffffff", "#cbd5e1");

    const schedItems = [
      { f: "Check-in & Reporting Window:", d: "Friday, December 15, 2026 | 08:30 AM to 09:30 AM IST (Parents may escort candidate)" },
      { f: "27.5-Hour Non-Stop Sprint:", d: "Commences Dec 15 at 11:00 AM; concludes Saturday, December 16 at 12:30 PM" },
      { f: "Overnight Accommodation:", d: "Dedicated, secure indoor rest dormitories on campus with female/male segregation" },
      { f: "Grand Valedictory & Release:", d: "Saturday, December 16, 2026 | 12:30 PM to 01:30 PM (Departure authorized)" },
      { f: "Campus Boundary Enforcement:", d: "Gates are locked throughout the event. Candidates cannot exit under any circumstance." },
    ];

    schedItems.forEach((s, idx) => {
      const sy = schBoxY + idx * 16.5;
      if (idx > 0) doc.moveTo(45, sy).lineTo(550, sy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(s.f, 52, sy + 3.5);
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(s.d, 195, sy + 3.5, { width: 345 });
    });

    // Hint
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text("[TURN OVER TO PAGE 2 FOR RESIDENTIAL GUARANTEES, MEDICAL CONSENT & SIGNATURES]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawPageFrame(doc, 2, 2, regId, "IHUB-PAR-CON-04", "PARENTAL OVERNIGHT PARTICIPATION CONSENT");

    const p2Top = 80;

    // Section 3: Campus Safety, Supervision & Welfare Guarantees
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 3: RESIDENTIAL SUPERVISION, DORMITORY SAFETY & WELFARE GUARANTEES", 45, p2Top);
    doc.moveTo(45, p2Top + 12).lineTo(550, p2Top + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const safeY = p2Top + 18;
    doc.rect(45, safeY, 505, 96).fillAndStroke("#ffffff", "#cbd5e1");

    const safePoints = [
      { t: "1. 24x7 Security & CCTV Surveillance:", d: "The entire 5-acre i-Hub campus is monitored continuously by high-definition CCTV cameras and licensed security personnel with restricted perimeter access." },
      { t: "2. Segregated Rest & Dormitory Lounges:", d: "Dedicated, air-conditioned resting spaces are provisioned with strict gender segregation. Female dormitories are managed exclusively by female wardens and guards." },
      { t: "3. On-Site Medical Desk & Paramedics:", d: "A fully equipped primary health center operates 24 hours with certified physicians, emergency medicines, and an on-call ambulance." },
      { t: "4. Wholesome Hygienic Catering:", d: "All 7 meals and midnight snacks are prepared fresh by certified FSSAI caterers on campus. Purified water stations are located across every laboratory." },
    ];

    safePoints.forEach((sp, idx) => {
      const spy = safeY + idx * 24;
      if (idx > 0) doc.moveTo(45, spy).lineTo(550, spy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text(sp.t, 52, spy + 4);
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(sp.d, 52, spy + 14, { width: 485, lineGap: 1 });
    });

    // Section 4: Emergency Medical Authorization
    const medTop = safeY + 110;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 4: EMERGENCY MEDICAL TREATMENT AUTHORIZATION", 45, medTop);
    doc.moveTo(45, medTop + 12).lineTo(550, medTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const medBoxY = medTop + 18;
    doc.rect(45, medBoxY, 505, 66).fillAndStroke("#fcfcfd", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text("STATUTORY MEDICAL EMPOWERMENT COVENANT", 55, medBoxY + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#1e293b").text(
      "In the improbable event of acute illness, injury, or medical emergency, I hereby empower the designated Medical Officer and Student Welfare Committee of i-Hub Gujarat to administer emergency first aid, prescribe medications, or arrange hospital admission (Civil Hospital / Sterling Hospital) while promptly notifying me via the emergency contact numbers on record.",
      55,
      medBoxY + 20,
      { width: 485, lineGap: 1.5 }
    );

    // Section 5: Digital 2FA Verification Audit Record
    const auditTop = medBoxY + 78;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 5: DIGITAL 2FA AUTHENTICATION AUDIT TRAIL", 45, auditTop);
    doc.moveTo(45, auditTop + 12).lineTo(550, auditTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const aBoxY = auditTop + 18;
    doc.rect(45, aBoxY, 505, 46).fillAndStroke("#ffffff", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text("PARENT EMAIL AUTHENTICATED:", 52, aBoxY + 6);
    doc.font("Helvetica").fontSize(7.5).fillColor("#4f46e5").text(parentEmail, 200, aBoxY + 6);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text("6-DIGIT OTP AUDIT VERIFIED:", 52, aBoxY + 20);
    doc.font("Courier-Bold").fontSize(7.5).fillColor("#059669").text("PASS (Cryptographically Verified)", 200, aBoxY + 20);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text("TIMESTAMP OF CONSENT:", 52, aBoxY + 34);
    doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(`${dateStr} | Logged via i-Hub Portal Gateway`, 200, aBoxY + 34);

    // Section 6: Formal Signatures & Parental Declaration
    const signTop = aBoxY + 58;
    doc.rect(45, signTop, 505, 96).fillAndStroke("#f8fafc", "#94a3b8");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("PARENT / GUARDIAN SIGNATURE & AFFIRMATION", 55, signTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#334155").text(
      "I confirm that I have willingly permitted my ward to participate in the i-Hub Gujarat Innovation Hackathon 2026 and agree to all terms stated herein.",
      55,
      signTop + 20,
      { width: 230, lineGap: 1.2 }
    );
    doc.moveTo(55, signTop + 68).lineTo(235, signTop + 68).lineWidth(0.5).strokeColor("#475569").stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text(`Signature: ${parentName}`, 55, signTop + 72);
    doc.font("Helvetica").fontSize(7).fillColor("#64748b").text(`Date: ${dateStr} | Mobile: ${parentPhone}`, 55, signTop + 82);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("i-HUB ADMISSIONS & WELFARE BOARD", 305, signTop + 8);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("DIRECTORATE OF STUDENT INNOVATION", 305, signTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Government of Gujarat Innovation Hub, Ahmedabad", 305, signTop + 32);
    doc.font("Courier-Bold").fontSize(8).fillColor("#059669").text("CONSENT DULY RECORDED & ARCHIVED", 305, signTop + 48);

    doc.rect(450, signTop + 14, 85, 68).strokeColor("#94a3b8").lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor("#94a3b8").text("PARENTAL\nCONSENT\nAUDIT SEAL", 450, signTop + 34, { align: "center", width: 85 });

    doc.end();
  });
}

/**
 * ============================================================================
 * 5. MASTER OFFICIAL HACKER BOARDING PASS (2 PAGES)
 * ============================================================================
 */
async function generateOfficialHackerPassPdf(data = {}) {
  const name = cleanText(data.participantName || "Alex Rivera");
  const regId = cleanText(data.registrationId || "IHUB-2026-9842");
  const team = cleanText(data.teamName || "Solo Innovator");
  const track = cleanText(data.track || "FinTech & Next-Gen Digital Payments");
  const booth = cleanText(data.boothNumber || "Booth #A-14");
  const diet = cleanText(data.foodPreference || "Pure Vegetarian");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}|MASTER-PASS|${booth}`),
    createQrCodeBuffer(`https://ihubgujarat.in/pass/${regId}`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: "A4", autoFirstPage: true });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ──────────────────────── PAGE 1 ────────────────────────
    drawPageFrame(doc, 1, 2, regId, "IHUB-BOARD-PASS-05", "MASTER OFFICIAL HACKER BOARDING PASS");

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT - i-HUB AHMEDABAD", 45, 48, { align: "center", width: 505 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#334155").text("GUJARAT INNOVATION HACKATHON 2026 - OFFICIAL BOARDING PASS", 45, 62, { align: "center", width: 505 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015 | Physical Access Docket", 45, 75, { align: "center", width: 505 });

    doc.moveTo(45, 88).lineTo(550, 88).lineWidth(1).strokeColor("#0f172a").stroke();
    doc.moveTo(45, 91).lineTo(550, 91).lineWidth(0.5).strokeColor("#94a3b8").stroke();

    // Boarding Pass Block
    doc.rect(45, 102, 505, 26).fillAndStroke("#312e81", "#312e81");
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#ffffff").text("OFFICIAL HACKER BOARDING PASS & ACCESS PERMIT", 45, 109, { align: "center", width: 505 });

    // Hacker details grid
    const gTop = 138;
    doc.rect(45, gTop, 505, 110).fillAndStroke("#ffffff", "#94a3b8");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#4f46e5").text("DELEGATE / INNOVATOR NAME", 55, gTop + 10);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#0f172a").text(name.toUpperCase(), 55, gTop + 22);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#4f46e5").text("REGISTRATION REF", 55, gTop + 44);
    doc.font("Courier-Bold").fontSize(11).fillColor("#0f172a").text(regId, 55, gTop + 56);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#4f46e5").text("SQUAD / SQUAD TRACK", 55, gTop + 76);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text(`${team} | ${track}`, 55, gTop + 88, { width: 240, ellipsis: true });

    // Right side highlights
    doc.rect(320, gTop + 10, 215, 90).fillAndStroke("#f1f5f9", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("ASSIGNED WORKSPACE BOOTH", 330, gTop + 18);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#4f46e5").text(booth, 330, gTop + 30);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("DIETARY COUNTER PASS", 330, gTop + 54);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#059669").text(diet.toUpperCase(), 330, gTop + 66);

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0f172a").text("DEC 15, 09:00 AM - DEC 16, 12:30 PM", 330, gTop + 84);

    // Barcode Block
    const barTop = gTop + 120;
    doc.rect(45, barTop, 505, 84).fillAndStroke("#f8fafc", "#cbd5e1");
    if (barcodeBuf) {
      doc.image(barcodeBuf, 60, barTop + 12, { width: 280, height: 44 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Master Boarding Barcode - Scan for Auditorium, Lab & FabLab Entry", 60, barTop + 62);
    }
    if (qrBuf) {
      doc.image(qrBuf, 400, barTop + 6, { width: 70, height: 70 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Live Pass QR", 400, barTop + 72, { align: "center", width: 70 });
    }

    // Schedule Overview
    const schedTop = barTop + 96;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 1: 4-STAGE ROUND CHRONOLOGY & EVALUATION TIMELINE", 45, schedTop);
    doc.moveTo(45, schedTop + 12).lineTo(550, schedTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

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
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#0f172a").text(item.t, 52, scY);
      doc.font("Helvetica").fontSize(7.5).fillColor("#334155").text(item.r, 220, scY, { width: 320 });
      scY += 15.5;
    });

    // Page 1 Footer hint
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#475569").text("[TURN OVER TO PAGE 2 FOR ACCESS ZONES, DISCIPLINARY DIRECTIVES & SIGNATURES]", 45, 770, { align: "right", width: 505 });

    // ──────────────────────── PAGE 2 ────────────────────────
    doc.addPage();
    drawPageFrame(doc, 2, 2, regId, "IHUB-BOARD-PASS-05", "MASTER OFFICIAL HACKER BOARDING PASS");

    const p2Top = 80;

    // Section 2: Campus Access Privileges
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECTION 2: CAMPUS ZONE ACCESS PRIVILEGES & PASS CLEARANCE", 45, p2Top);
    doc.moveTo(45, p2Top + 12).lineTo(550, p2Top + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const zoneY = p2Top + 18;
    doc.rect(45, zoneY, 505, 96).fillAndStroke("#ffffff", "#cbd5e1");

    const zones = [
      { z: "Zone 1: Main Coding Arena & Tech Atrium", a: "UNRESTRICTED ACCESS", c: "Dedicated high-speed desk, ergonomic seating & dual power ports." },
      { z: "Zone 2: i-Hub Makerspace & IoT FabLab", a: "AUTHORIZED CLEARANCE", c: "Access to 3D rapid prototyping, PCB solder stations & test equipment." },
      { z: "Zone 3: Mentor & Jury Pitch Suites", a: "BY APPOINTMENT", c: "Round 2 & Round 3 evaluation suites with private meeting docks." },
      { z: "Zone 4: Overnight Rest Lounges & Dorms", a: "BIOMETRIC ENTRY", c: "Segregated, supervised rest quarters with female-only secured wings." },
    ];

    zones.forEach((zn, idx) => {
      const zy = zoneY + idx * 24;
      if (idx > 0) doc.moveTo(45, zy).lineTo(550, zy).lineWidth(0.5).strokeColor("#f1f5f9").stroke();
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#0f172a").text(zn.z, 52, zy + 4);
      doc.font("Courier-Bold").fontSize(7.5).fillColor("#059669").text(zn.a, 380, zy + 4, { align: "right", width: 155 });
      doc.font("Helvetica").fontSize(7.5).fillColor("#475569").text(zn.c, 52, zy + 14, { width: 485 });
    });

    // Mandatory Security Warning
    const warnTop = zoneY + 112;
    doc.rect(45, warnTop, 505, 68).fillAndStroke("#fcfcfd", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("MANDATORY CAMPUS DISQUALIFICATION WARNING", 55, warnTop + 8);
    doc.font("Helvetica").fontSize(7.5).fillColor("#1e293b").text(
      "The campus gates are strictly sealed throughout the 27.5-hour hackathon. Stepping outside the campus perimeter without authorized written permission from the Chief Warden results in IMMEDIATE PERMANENT DISQUALIFICATION alongside your entire squad with no second chance.",
      55,
      warnTop + 20,
      { width: 485, lineGap: 1.8 }
    );

    // Authority Signatures
    const passSignTop = warnTop + 82;
    doc.rect(45, passSignTop, 505, 96).fillAndStroke("#f8fafc", "#94a3b8");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("ORGANIZING AUTHORITY", 55, passSignTop + 8);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("i-HUB ADMISSIONS & JURY COMMITTEE", 55, passSignTop + 20);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Government of Gujarat Innovation Hub, Ahmedabad", 55, passSignTop + 32);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#059669").text("OFFICIALLY ISSUED BOARDING PASS", 55, passSignTop + 52);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("HACKER IDENTIFICATION", 300, passSignTop + 8);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`NAME: ${name.toUpperCase()}`, 300, passSignTop + 20);
    doc.font("Courier-Bold").fontSize(8).fillColor("#0f172a").text(`REF ID: ${regId}`, 300, passSignTop + 34);
    doc.font("Helvetica").fontSize(8).fillColor("#334155").text(`BOOTH: ${booth}`, 300, passSignTop + 48);

    doc.rect(440, passSignTop + 14, 95, 68).strokeColor("#94a3b8").lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor("#94a3b8").text("OFFICIAL\nINNOVATION HUB\nEMBOSSED SEAL", 440, passSignTop + 34, { align: "center", width: 95 });

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
