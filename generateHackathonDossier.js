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
      textsize: 9,
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
 * 1. Official Registration Receipt PDF
 * Professional institutional document format with official header, metadata table, barcode, and verification QR.
 */
async function generateRegistrationReceiptPdf(data = {}) {
  const name = (data.participantName || "Alex Rivera").replace(/&amp;/g, "&");
  const regId = data.registrationId || "IHUB-2026-9842";
  const team = (data.teamName || "Solo").replace(/&amp;/g, "&");
  const track = (data.track || "AI, Generative Agents & Automation").replace(/&amp;/g, "&");
  const college = (data.college || "Gujarat University").replace(/&amp;/g, "&");
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(regId),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?type=receipt`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Document Frame (Clean double border)
    doc.lineWidth(1).strokeColor("#0f172a").rect(30, 30, 535, 782).stroke();
    doc.lineWidth(0.5).strokeColor("#94a3b8").rect(34, 34, 527, 774).stroke();

    // Institutional Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT", 40, 50, { align: "center", width: 515 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#475569").text("GUJARAT STUDENT STARTUP AND INNOVATION HUB (i-HUB)", 40, 64, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text("KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015", 40, 77, { align: "center", width: 515 });

    doc.moveTo(40, 92).lineTo(555, 92).lineWidth(1).strokeColor("#0f172a").stroke();
    doc.moveTo(40, 95).lineTo(555, 95).lineWidth(0.5).strokeColor("#94a3b8").stroke();

    // Document Title & Reference
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#0f172a").text("OFFICIAL HACKATHON REGISTRATION RECEIPT", 40, 110, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(9).fillColor("#475569").text(`EVENT: i-HUB GUJARAT INNOVATION HACKATHON 2026`, 40, 128, { align: "center", width: 515 });

    // Status Badge Block
    doc.rect(40, 148, 515, 24).fillAndStroke("#f8fafc", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text("STATUS: REGISTRATION OFFICIALLY CONFIRMED & VERIFIED", 50, 155);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`DATE ISSUED: ${dateStr.toUpperCase()}`, 380, 155, { align: "right", width: 165 });

    // Applicant & Squad Details Table
    const tableTop = 185;
    const rowHeight = 26;
    doc.rect(40, tableTop, 515, rowHeight * 5).fillAndStroke("#ffffff", "#94a3b8");

    // Grid Horizontal Dividers
    for (let i = 1; i < 5; i++) {
      doc.moveTo(40, tableTop + i * rowHeight).lineTo(555, tableTop + i * rowHeight).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
    }
    // Vertical divider
    doc.moveTo(280, tableTop).lineTo(280, tableTop + rowHeight * 5).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    // Row 1
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("APPLICANT FULL NAME", 50, tableTop + 5);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(name, 50, tableTop + 14);

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("REGISTRATION REFERENCE ID", 290, tableTop + 5);
    doc.font("Courier-Bold").fontSize(11).fillColor("#0f172a").text(regId, 290, tableTop + 14);

    // Row 2
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("INSTITUTION / COLLEGE / ORG", 50, tableTop + rowHeight + 5);
    doc.font("Helvetica").fontSize(9.5).fillColor("#0f172a").text(college, 50, tableTop + rowHeight + 14, { width: 220, ellipsis: true });

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("SQUAD / TEAM NAME", 290, tableTop + rowHeight + 5);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(team, 290, tableTop + rowHeight + 14);

    // Row 3
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("CHALLENGE TRACK", 50, tableTop + rowHeight * 2 + 5);
    doc.font("Helvetica").fontSize(9.5).fillColor("#0f172a").text(track, 50, tableTop + rowHeight * 2 + 14, { width: 220, ellipsis: true });

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("PARTICIPATION MODE", 290, tableTop + rowHeight * 2 + 5);
    doc.font("Helvetica").fontSize(9.5).fillColor("#0f172a").text(team === "Solo" ? "Individual (Solo Innovator)" : "Team Squad Lead", 290, tableTop + rowHeight * 2 + 14);

    // Row 4
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("EVENT DATES & TIMINGS", 50, tableTop + rowHeight * 3 + 5);
    doc.font("Helvetica").fontSize(9).fillColor("#0f172a").text("December 15, 09:00 AM to December 16, 12:30 PM", 50, tableTop + rowHeight * 3 + 14);

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("VENUE SECTOR", 290, tableTop + rowHeight * 3 + 5);
    doc.font("Helvetica").fontSize(9).fillColor("#0f172a").text("Prajna Puram, Navrangpura, Ahmedabad", 290, tableTop + rowHeight * 3 + 14);

    // Row 5
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("REPORTING / GATE CHECK-IN", 50, tableTop + rowHeight * 4 + 5);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("Monday, December 15, 2026 at 09:00 AM IST", 50, tableTop + rowHeight * 4 + 14);

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#64748b").text("SECURITY BADGE PRINTING", 290, tableTop + rowHeight * 4 + 5);
    doc.font("Helvetica").fontSize(9).fillColor("#0f172a").text("Terminal Gate 1 & 2 (Main Porch)", 290, tableTop + rowHeight * 4 + 14);

    // Registration Checklist Section
    const checkTop = 330;
    doc.rect(40, checkTop, 515, 120).fillAndStroke("#fcfcfd", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("REGISTRATION DOSSIER AUDIT & VALIDATION CHECKLIST", 50, checkTop + 10);

    const checklist = [
      ["[ VERIFIED ]", "Applicant & Squad Profile Authenticated via 2-Factor OTP verification."],
      ["[ VERIFIED ]", "Meal & Catering Pass Provisioned with specific dietary counters."],
      ["[ ACCEPTED ]", "Campus Safety, Disqualification & Zero-Tolerance Anti-Exit Undertaking on record."],
      ["[ RECORDED ]", "Parental / Guardian Consent logged for 27.5-hour on-campus presence."],
      ["[ APPROVED ]", "Hardware & Personal Computing Clearance authorized for security entry."],
    ];

    let checkY = checkTop + 28;
    checklist.forEach(([tag, desc]) => {
      doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(tag, 50, checkY);
      doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text(desc, 135, checkY);
      checkY += 17;
    });

    // Verification Section with Real Barcode & QR Code
    const authTop = 465;
    doc.rect(40, authTop, 515, 120).fillAndStroke("#ffffff", "#94a3b8");

    // Left: QR Code
    if (qrBuf) {
      doc.image(qrBuf, 52, authTop + 10, { width: 100, height: 100 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Scan to Authenticate", 52, authTop + 112, { width: 100, align: "center" });
    }

    // Right: Barcode + Details
    if (barcodeBuf) {
      doc.image(barcodeBuf, 175, authTop + 18, { width: 250, height: 42 });
    }
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`SECURITY SCANNER IDENTIFIER: ${regId}`, 175, authTop + 68);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text("This barcode is encoded with candidate identity metadata and verified by i-Hub Security Cell.", 175, authTop + 80, { width: 360 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Keep this document accessible on your phone or in printed format for fast-track badge collection.", 175, authTop + 94, { width: 360 });

    // Official Rules & Entry Protocol
    const ruleTop = 600;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("MANDATORY ENTRY & REPORTING DIRECTIVES", 40, ruleTop);
    doc.moveTo(40, ruleTop + 12).lineTo(555, ruleTop + 12).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    const rules = [
      "1. Physical Government Photo ID (Aadhaar, Voter ID, Passport) and College ID Card are mandatory at check-in.",
      "2. Gate clearance closes promptly at 10:30 AM on December 15. Late arrivals will not be accommodated.",
      "3. Laptops, peripherals, and developer boards must be logged at the property counter before entering the hacking bay.",
      "4. The campus perimeter is sealed throughout the event. Stepping outside results in immediate disqualification.",
    ];

    let rY = ruleTop + 18;
    rules.forEach((r) => {
      doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text(r, 40, rY, { width: 515, lineGap: 2 });
      rY += 15;
    });

    // Signature & Seal Box
    const signTop = 680;
    doc.rect(40, signTop, 515, 85).fillAndStroke("#f8fafc", "#cbd5e1");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("ISSUING AUTHORITY", 55, signTop + 10);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("ADMISSIONS & SCRUTINY COMMITTEE", 55, signTop + 22);
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Gujarat Student Startup & Innovation Hub (i-Hub)", 55, signTop + 34);
    doc.font("Helvetica").fontSize(7.5).fillColor("#059669").text("DIGITALLY SIGNED & OFFICIALLY DISPATCHED", 55, signTop + 54);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("CANDIDATE ACKNOWLEDGMENT", 330, signTop + 10);
    doc.font("Helvetica").fontSize(8).fillColor("#334155").text("Signature on file via two-factor electronic authentication.", 330, signTop + 22, { width: 210 });
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(`NAME: ${name.toUpperCase()}`, 330, signTop + 42);
    doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(`ID: ${regId}`, 330, signTop + 54);

    // Bottom Watermark
    doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Document Reference: ${regId}-RECEIPT-OFFICIAL • Issued under Government of Gujarat i-Hub Hackathon Mandate`, 40, 792, { align: "center", width: 515 });

    doc.end();
  });
}

/**
 * 2. Official Food & Catering Meal Pass PDF
 * Clean, tabular coupon pass with real barcode and QR code, showing scheduled meal times.
 */
async function generateFoodPassPdf(data = {}) {
  const name = (data.participantName || "Alex Rivera").replace(/&amp;/g, "&");
  const regId = data.registrationId || "IHUB-2026-9842";
  const diet = (data.foodPreference || "Pure Vegetarian").replace(/&amp;/g, "&");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}-FOOD`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?type=food`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Frame
    doc.lineWidth(1).strokeColor("#0f172a").rect(30, 30, 535, 782).stroke();
    doc.lineWidth(0.5).strokeColor("#94a3b8").rect(34, 34, 527, 774).stroke();

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 40, 50, { align: "center", width: 515 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#475569").text("HOSPITALITY, CATERING & LOGISTICS CELL", 40, 64, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text("Prajna Puram, KCG Campus, Navrangpura, Ahmedabad 380015", 40, 77, { align: "center", width: 515 });

    doc.moveTo(40, 92).lineTo(555, 92).lineWidth(1).strokeColor("#0f172a").stroke();

    doc.font("Helvetica-Bold").fontSize(14).fillColor("#0f172a").text("OFFICIAL CATERING & MEAL COUPON PASS", 40, 108, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(9).fillColor("#475569").text("EVENT DATES: DECEMBER 15, 09:00 AM – DECEMBER 16, 12:30 PM", 40, 126, { align: "center", width: 515 });

    // Participant Credentials Block
    const metaTop = 145;
    doc.rect(40, metaTop, 515, 60).fillAndStroke("#ffffff", "#94a3b8");
    doc.moveTo(290, metaTop).lineTo(290, metaTop + 60).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
    doc.moveTo(40, metaTop + 30).lineTo(555, metaTop + 30).lineWidth(0.5).strokeColor("#e2e8f0").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("PARTICIPANT NAME", 50, metaTop + 5);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(name, 50, metaTop + 15);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("PASS REFERENCE ID", 300, metaTop + 5);
    doc.font("Courier-Bold").fontSize(10).fillColor("#0f172a").text(regId, 300, metaTop + 15);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("REGISTERED DIETARY PLAN", 50, metaTop + 35);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(diet.toUpperCase(), 50, metaTop + 45);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("DINING ALLOCATION", 300, metaTop + 35);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("Main Dining Hall • Segregated Counters", 300, metaTop + 45);

    // Meal Schedule Table
    const mealTop = 220;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text("SCHEDULED ON-CAMPUS MEALS & COUPON IDENTIFIERS", 40, mealTop);
    doc.moveTo(40, mealTop + 14).lineTo(555, mealTop + 14).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const meals = [
      { date: "Dec 15", time: "09:00 AM – 10:30 AM", slot: "Welcome Breakfast, Tea & Refreshments", coupon: "MEAL-B1" },
      { date: "Dec 15", time: "01:00 PM – 02:30 PM", slot: "Grand Buffet Lunch (Gujarati / North Indian)", coupon: "MEAL-L1" },
      { date: "Dec 15", time: "05:00 PM – 06:00 PM", slot: "High Tea, Coffee & Traditional Snacks", coupon: "MEAL-T1" },
      { date: "Dec 15", time: "08:30 PM – 10:00 PM", slot: "Executive Dinner Buffet", coupon: "MEAL-D1" },
      { date: "Dec 16", time: "01:30 AM – 03:00 AM", slot: "Midnight Energy Boost, Snacks & Beverages", coupon: "MEAL-MN" },
      { date: "Dec 16", time: "07:30 AM – 09:00 AM", slot: "Sprint Power Breakfast & Fresh Fruit", coupon: "MEAL-B2" },
      { date: "Dec 16", time: "12:30 PM – 02:00 PM", slot: "Finale Celebration Lunch", coupon: "MEAL-L2" },
    ];

    let rowY = mealTop + 22;
    doc.rect(40, rowY, 515, 20).fill("#f1f5f9");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("DATE", 50, rowY + 6);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("SERVICE WINDOW", 120, rowY + 6);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("MEAL DESCRIPTION", 250, rowY + 6);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("COUPON REF", 470, rowY + 6);

    rowY += 22;
    meals.forEach((m, idx) => {
      if (idx % 2 === 1) {
        doc.rect(40, rowY - 2, 515, 22).fill("#f8fafc");
      }
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text(m.date, 50, rowY + 3);
      doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text(m.time, 120, rowY + 3);
      doc.font("Helvetica").fontSize(8.5).fillColor("#0f172a").text(m.slot, 250, rowY + 3, { width: 210 });
      doc.font("Courier-Bold").fontSize(9).fillColor("#0f172a").text(m.coupon, 470, rowY + 3);

      doc.moveTo(40, rowY + 20).lineTo(555, rowY + 20).lineWidth(0.5).strokeColor("#e2e8f0").stroke();
      rowY += 24;
    });

    // Barcode & QR Verification Box
    const barTop = 445;
    doc.rect(40, barTop, 515, 115).fillAndStroke("#ffffff", "#94a3b8");

    if (qrBuf) {
      doc.image(qrBuf, 52, barTop + 10, { width: 95, height: 95 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Scan at Dining Desk", 52, barTop + 105, { width: 95, align: "center" });
    }

    if (barcodeBuf) {
      doc.image(barcodeBuf, 175, barTop + 15, { width: 250, height: 42 });
    }
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`CAFETERIA BARCODE: ${regId}-FOOD-${diet.slice(0, 3).toUpperCase()}`, 175, barTop + 65);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text("Present this pass on your device or in print at the cafeteria turnstiles for electronic verification.", 175, barTop + 78, { width: 360 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Dedicated preparation counters are provided for Jain and Swaminarayan requirements.", 175, barTop + 92, { width: 360 });

    // Guidelines Box
    const noteTop = 580;
    doc.rect(40, noteTop, 515, 80).fillAndStroke("#fcfcfd", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text("DINING HALL PROTOCOLS & GUIDELINES", 50, noteTop + 10);

    const diningNotes = [
      "1. Meal passes are non-transferable and assigned exclusively to the registered participant.",
      "2. Continuous coffee, tea, and packaged water stations operate 24 hours in all main hacking bays.",
      "3. All food items must be consumed in designated dining zones; eating at developer stations is prohibited.",
      "4. Inform the hospitality desk immediately if you experience allergic reactions or require dietary changes.",
    ];

    let dnY = noteTop + 24;
    diningNotes.forEach((note) => {
      doc.font("Helvetica").fontSize(8).fillColor("#334155").text(note, 50, dnY, { width: 495 });
      dnY += 13;
    });

    // Issuing Authority
    const authSignTop = 675;
    doc.rect(40, authSignTop, 515, 85).fillAndStroke("#f8fafc", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("AUTHORIZED SIGNATURE", 55, authSignTop + 10);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("HOSPITALITY CELL // i-HUB AHMEDABAD", 55, authSignTop + 22);
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("State Student Startup & Innovation Hub, Prajna Puram, Ahmedabad", 55, authSignTop + 34);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#059669").text("DIGITALLY VALIDATED CATERING PASS", 55, authSignTop + 54);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("PARTICIPANT DETAILS", 330, authSignTop + 10);
    doc.font("Helvetica").fontSize(8.5).fillColor("#0f172a").text(`NAME: ${name.toUpperCase()}`, 330, authSignTop + 22);
    doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(`REF ID: ${regId}`, 330, authSignTop + 36);
    doc.font("Helvetica").fontSize(8.5).fillColor("#0f172a").text(`PLAN: ${diet}`, 330, authSignTop + 50);

    doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Document Reference: ${regId}-FOOD-PASS • i-Hub Catering Control System`, 40, 792, { align: "center", width: 515 });

    doc.end();
  });
}

/**
 * 3. Official Campus Security & Anti-Exit Undertaking PDF
 * Formal legal undertaking with clear strict clause, barcode, QR code, and signature fields.
 */
async function generateSecurityUndertakingPdf(data = {}) {
  const name = (data.participantName || "Alex Rivera").replace(/&amp;/g, "&");
  const regId = data.registrationId || "IHUB-2026-9842";
  const team = (data.teamName || "Solo").replace(/&amp;/g, "&");
  const track = (data.track || "AI, Generative Agents & Automation").replace(/&amp;/g, "&");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}-SEC`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?type=security`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Frame
    doc.lineWidth(1).strokeColor("#0f172a").rect(30, 30, 535, 782).stroke();
    doc.lineWidth(0.5).strokeColor("#94a3b8").rect(34, 34, 527, 774).stroke();

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 40, 50, { align: "center", width: 515 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#475569").text("CHIEF PROCTORIAL BOARD & CAMPUS SECURITY CELL", 40, 64, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text("Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad 380015", 40, 77, { align: "center", width: 515 });

    doc.moveTo(40, 92).lineTo(555, 92).lineWidth(1).strokeColor("#0f172a").stroke();

    doc.font("Helvetica-Bold").fontSize(13.5).fillColor("#0f172a").text("CAMPUS SECURITY UNDERTAKING & ZERO-TOLERANCE POLICY", 40, 108, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#475569").text("MANDATORY CLEARANCE DOCUMENT FOR ON-CAMPUS PARTICIPATION", 40, 125, { align: "center", width: 515 });

    // Candidate Reference Block
    const secMetaTop = 142;
    doc.rect(40, secMetaTop, 515, 48).fillAndStroke("#ffffff", "#94a3b8");
    doc.moveTo(290, secMetaTop).lineTo(290, secMetaTop + 48).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
    doc.moveTo(40, secMetaTop + 24).lineTo(555, secMetaTop + 24).lineWidth(0.5).strokeColor("#e2e8f0").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("CANDIDATE FULL NAME", 50, secMetaTop + 4);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text(name, 50, secMetaTop + 13);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("SECURITY REGISTRATION ID", 300, secMetaTop + 4);
    doc.font("Courier-Bold").fontSize(10).fillColor("#0f172a").text(regId, 300, secMetaTop + 13);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("AFFILIATED SQUAD / TEAM", 50, secMetaTop + 28);
    doc.font("Helvetica").fontSize(9).fillColor("#0f172a").text(team, 50, secMetaTop + 37);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("CHALLENGE DOMAIN", 300, secMetaTop + 28);
    doc.font("Helvetica").fontSize(9).fillColor("#0f172a").text(track, 300, secMetaTop + 37, { width: 240, ellipsis: true });

    // CRITICAL NOTICE: Anti-Exit Clause
    const clauseTop = 202;
    doc.rect(40, clauseTop, 515, 95).fillAndStroke("#fcfcfd", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text("STATUTORY ANTI-EXIT & DISQUALIFICATION CLAUSE (NON-NEGOTIABLE)", 50, clauseTop + 10);

    const antiExitText =
      "The i-Hub Gujarat Innovation Hackathon is a closed, secure, 27.5-hour continuous technical event spanning from December 15, 09:00 AM to December 16, 12:30 PM. Participants are strictly prohibited from exiting the official campus gates at Navrangpura during the competition window.\n\n" +
      "Any participant who exits the campus boundaries without prior written gate authorization issued by the Chief Security Officer and Chief Event Proctor shall face IMMEDIATE DISQUALIFICATION of their entry and their entire team squad. Disqualified candidates will be barred from evaluation, prizes, and future i-Hub initiatives without right of appeal.";

    doc.font("Helvetica").fontSize(8.5).fillColor("#1e293b").text(antiExitText, 50, clauseTop + 25, { width: 495, lineGap: 3 });

    // Security Rules
    const secRulesTop = 310;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("SECURITY OPERATING DIRECTIVES & PROTOCOLS", 40, secRulesTop);
    doc.moveTo(40, secRulesTop + 12).lineTo(555, secRulesTop + 12).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    const directives = [
      "1. Identification Badges: The RFID/NFC hacker badge provided at registration must remain visible around the participant's neck at all times.",
      "2. Night Perimeter Protocol: Campus exit gates are secured between 10:00 PM and 06:00 AM. 24-hour surveillance cameras and security marshals are deployed.",
      "3. Equipment Tagging: Personal laptops, tablets, and microcontroller boards must match serial tags logged at the check-in security desk.",
      "4. Emergency Medical Care: Medical personnel and emergency transport are stationed 24/7 on campus. Report any illness or fatigue to floor marshals.",
      "5. Zero Tolerance: Possession or use of alcohol, tobacco, e-cigarettes, or prohibited substances is strictly forbidden on government property and will result in police action.",
    ];

    let dY = secRulesTop + 18;
    directives.forEach((d) => {
      doc.font("Helvetica").fontSize(8).fillColor("#334155").text(d, 40, dY, { width: 515, lineGap: 2 });
      dY += 21;
    });

    // Verification Barcode & QR Code Section
    const secCodeTop = 445;
    doc.rect(40, secCodeTop, 515, 115).fillAndStroke("#ffffff", "#94a3b8");

    if (qrBuf) {
      doc.image(qrBuf, 52, secCodeTop + 10, { width: 95, height: 95 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Scan to Verify Security Clearance", 45, secCodeTop + 105, { width: 110, align: "center" });
    }

    if (barcodeBuf) {
      doc.image(barcodeBuf, 175, secCodeTop + 15, { width: 250, height: 42 });
    }
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`SECURITY CLEARANCE TOKEN: ${regId}-SEC-CLEARED`, 175, secCodeTop + 65);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text("This barcode is scanned by gate security upon initial entry and during mandatory badge spot-checks.", 175, secCodeTop + 78, { width: 360 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Cryptographically signed via two-factor OTP verification at the time of online portal registration.", 175, secCodeTop + 92, { width: 360 });

    // Formal Undertaking Statement
    const underTop = 580;
    doc.rect(40, underTop, 515, 80).fillAndStroke("#fcfcfd", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text("CANDIDATE SOLEMN UNDERTAKING", 50, underTop + 10);

    const statement = `I, ${name.toUpperCase()} (Registration ID: ${regId}), hereby formally declare that I have read, understood, and agreed to be bound by the i-Hub Campus Security Guidelines and the strict anti-exit policy. I confirm that I will remain within the authorized perimeter throughout the event window and accept full responsibility for compliance.`;
    doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text(statement, 50, underTop + 24, { width: 495, lineGap: 2 });

    // Signatures
    const signBoxTop = 675;
    doc.rect(40, signBoxTop, 515, 85).fillAndStroke("#f8fafc", "#cbd5e1");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("CAMPUS PROCTOR / SECURITY HEAD", 55, signBoxTop + 10);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("CHIEF SECURITY CELL", 55, signBoxTop + 22);
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("i-Hub Gujarat, Navrangpura, Ahmedabad", 55, signBoxTop + 34);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#059669").text("STATUS: ELECTRONIC CLEARANCE RECORDED", 55, signBoxTop + 54);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("DIGITALLY SIGNED BY CANDIDATE", 330, signBoxTop + 10);
    doc.font("Helvetica").fontSize(8.5).fillColor("#0f172a").text(`NAME: ${name.toUpperCase()}`, 330, signBoxTop + 22);
    doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(`REF ID: ${regId}`, 330, signBoxTop + 36);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Signed via 2FA verification on registration portal.", 330, signBoxTop + 50);

    doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Document Reference: ${regId}-UNDERTAKING • Official i-Hub Security Record`, 40, 792, { align: "center", width: 515 });

    doc.end();
  });
}

/**
 * 4. Official Parental & Guardian Approval Form PDF
 * Clean, structured consent letter with guardian authorization, emergency phone, and verification codes.
 */
async function generateParentalConsentPdf(data = {}) {
  const name = (data.participantName || "Alex Rivera").replace(/&amp;/g, "&");
  const regId = data.registrationId || "IHUB-2026-9842";
  const parentName = (data.parentName || data.parentalApproval?.parentName || "Parent / Guardian").replace(/&amp;/g, "&");
  const parentPhone = data.parentPhone || data.parentalApproval?.parentPhone || "+91 98765 00000";
  const relationship = data.relationship || data.parentalApproval?.relationship || "Guardian";

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(`${regId}-PARENT`),
    createQrCodeBuffer(`https://ihubgujarat.in/verify/${regId}?type=parental`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Frame
    doc.lineWidth(1).strokeColor("#0f172a").rect(30, 30, 535, 782).stroke();
    doc.lineWidth(0.5).strokeColor("#94a3b8").rect(34, 34, 527, 774).stroke();

    // Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 40, 50, { align: "center", width: 515 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#475569").text("STUDENT WELFARE & GUARDIAN OVERSIGHT CELL", 40, 64, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text("Prajna Puram, KCG Campus, Navrangpura, Ahmedabad 380015", 40, 77, { align: "center", width: 515 });

    doc.moveTo(40, 92).lineTo(555, 92).lineWidth(1).strokeColor("#0f172a").stroke();

    doc.font("Helvetica-Bold").fontSize(13.5).fillColor("#0f172a").text("PARENT / GUARDIAN APPROVAL & OVERNIGHT CONSENT FORM", 40, 108, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#475569").text("FORMAL AUTHORIZATION FOR 27.5-HOUR ON-CAMPUS PARTICIPATION", 40, 125, { align: "center", width: 515 });

    // Details Grid
    const pMetaTop = 142;
    doc.rect(40, pMetaTop, 515, 60).fillAndStroke("#ffffff", "#94a3b8");
    doc.moveTo(290, pMetaTop).lineTo(290, pMetaTop + 60).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
    doc.moveTo(40, pMetaTop + 30).lineTo(555, pMetaTop + 30).lineWidth(0.5).strokeColor("#e2e8f0").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("STUDENT / CANDIDATE NAME", 50, pMetaTop + 5);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(name, 50, pMetaTop + 15);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("STUDENT REGISTRATION ID", 300, pMetaTop + 5);
    doc.font("Courier-Bold").fontSize(10).fillColor("#0f172a").text(regId, 300, pMetaTop + 15);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("PARENT / GUARDIAN FULL NAME", 50, pMetaTop + 35);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(parentName, 50, pMetaTop + 45);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("RELATIONSHIP & EMERGENCY CONTACT", 300, pMetaTop + 35);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text(`${relationship.toUpperCase()} • ${parentPhone}`, 300, pMetaTop + 45);

    // Terms of Consent Box
    const termsTop = 220;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text("TERMS OF PARENTAL / GUARDIAN AUTHORIZATION", 40, termsTop);
    doc.moveTo(40, termsTop + 12).lineTo(555, termsTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const clauses = [
      "1. Overnight Campus Presence: I hereby grant formal authorization for my child/ward to stay on-campus overnight at i-Hub Ahmedabad (Navrangpura) from December 15, 09:00 AM to December 16, 12:30 PM for the innovation hackathon.",
      "2. Security Boundaries & Compliance: I acknowledge that my child/ward must remain strictly within the monitored i-Hub campus perimeter throughout the competition window and that unauthorized exit results in instant disqualification.",
      "3. Medical Care Consent: In the case of acute illness, fatigue, or accident, I authorize certified i-Hub first responders to administer immediate emergency aid and, if required, transfer to a partner hospital.",
      "4. Emergency Availability: I affirm that the emergency telephone contact provided on this form will remain reachable 24 hours a day during the event window.",
      "5. Electronic Signature Validity: I verify that this consent form was reviewed, authorized, and validated through two-factor email OTP verification.",
    ];

    let cY = termsTop + 20;
    clauses.forEach((c) => {
      doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text(c, 40, cY, { width: 515, lineGap: 3 });
      cY += 29;
    });

    // Verification Barcode & QR Code Section
    const pCodeTop = 385;
    doc.rect(40, pCodeTop, 515, 115).fillAndStroke("#ffffff", "#94a3b8");

    if (qrBuf) {
      doc.image(qrBuf, 52, pCodeTop + 10, { width: 95, height: 95 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Scan to Verify Consent", 45, pCodeTop + 105, { width: 110, align: "center" });
    }

    if (barcodeBuf) {
      doc.image(barcodeBuf, 175, pCodeTop + 15, { width: 250, height: 42 });
    }
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`PARENTAL CLEARANCE IDENTIFIER: ${regId}-PARENT-VERIFIED`, 175, pCodeTop + 65);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text("This record confirms that parental consent has been officially validated by i-Hub Admissions Board.", 175, pCodeTop + 78, { width: 360 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text(`Primary Emergency Contact on record: ${parentPhone} (${relationship}).`, 175, pCodeTop + 92, { width: 360 });

    // Official 24/7 Helpdesk Box
    const helpTop = 520;
    doc.rect(40, helpTop, 515, 60).fillAndStroke("#fcfcfd", "#cbd5e1");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("24/7 DEDICATED PARENT HELPDESK & CONTROL ROOM", 50, helpTop + 10);
    doc.font("Helvetica").fontSize(8.5).fillColor("#334155").text("Control Room Phone: +91 79 2630 0000 / +91 98765 00000  |  Email: emergency@ihubgujarat.in", 50, helpTop + 24);
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Campus Address: Prajna Puram, KCG Campus, Opp. Physical Research Laboratory (PRL), Navrangpura, Ahmedabad 380015", 50, helpTop + 38);

    // Signatures Block
    const pSignTop = 600;
    doc.rect(40, pSignTop, 515, 90).fillAndStroke("#f8fafc", "#cbd5e1");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("STUDENT WELFARE CELL", 55, pSignTop + 10);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("i-HUB ADMISSIONS & WELFARE BOARD", 55, pSignTop + 22);
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Government of Gujarat Innovation Hub, Ahmedabad", 55, pSignTop + 34);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#059669").text("STATUS: DIGITALLY RATIFIED VIA PORTAL 2FA", 55, pSignTop + 54);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("PARENT / GUARDIAN CONFIRMATION", 330, pSignTop + 10);
    doc.font("Helvetica").fontSize(8.5).fillColor("#0f172a").text(`NAME: ${parentName.toUpperCase()}`, 330, pSignTop + 22);
    doc.font("Helvetica").fontSize(8).fillColor("#334155").text(`RELATION: ${relationship}  |  PHONE: ${parentPhone}`, 330, pSignTop + 36);
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748b").text("Electronically authenticated by parent code verification.", 330, pSignTop + 50);

    doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Document Reference: ${regId}-PARENTAL-CONSENT • Authorized i-Hub Legal Instrument`, 40, 792, { align: "center", width: 515 });

    doc.end();
  });
}

/**
 * 5. Official Master Hacker Boarding Pass PDF
 * The official credential required for campus entry, kit bag retrieval, and hacking booth assignment.
 */
async function generateOfficialHackerPassPdf(data = {}) {
  const name = (data.participantName || "Alex Rivera").replace(/&amp;/g, "&");
  const regId = data.registrationId || "IHUB-2026-9842";
  const team = (data.teamName || "Solo").replace(/&amp;/g, "&");
  const track = (data.track || "AI, Generative Agents & Automation").replace(/&amp;/g, "&");
  const booth = (data.boothNumber || "Booth #A-14").replace(/&amp;/g, "&");
  const diet = (data.foodPreference || "Pure Vegetarian").replace(/&amp;/g, "&");

  const [barcodeBuf, qrBuf] = await Promise.all([
    createBarcodeBuffer(regId),
    createQrCodeBuffer(`https://ihubgujarat.in/pass/${regId}`),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Frame
    doc.lineWidth(1).strokeColor("#0f172a").rect(30, 30, 535, 782).stroke();
    doc.lineWidth(0.5).strokeColor("#94a3b8").rect(34, 34, 527, 774).stroke();

    // Institutional Header
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 40, 50, { align: "center", width: 515 });
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#475569").text("GUJARAT STUDENT STARTUP AND INNOVATION HUB", 40, 64, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text("Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad 380015", 40, 77, { align: "center", width: 515 });

    doc.moveTo(40, 92).lineTo(555, 92).lineWidth(1).strokeColor("#0f172a").stroke();

    doc.font("Helvetica-Bold").fontSize(15).fillColor("#0f172a").text("OFFICIAL HACKER BOARDING PASS", 40, 108, { align: "center", width: 515 });
    doc.font("Helvetica").fontSize(9).fillColor("#475569").text("i-HUB GUJARAT INNOVATION HACKATHON 2026", 40, 126, { align: "center", width: 515 });

    // Primary Credentials Grid
    const passMetaTop = 145;
    doc.rect(40, passMetaTop, 515, 80).fillAndStroke("#ffffff", "#94a3b8");
    doc.moveTo(290, passMetaTop).lineTo(290, passMetaTop + 80).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
    doc.moveTo(40, passMetaTop + 40).lineTo(555, passMetaTop + 40).lineWidth(0.5).strokeColor("#e2e8f0").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("HACKER NAME", 50, passMetaTop + 6);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#0f172a").text(name, 50, passMetaTop + 18);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("BOARDING PASS REF ID", 300, passMetaTop + 6);
    doc.font("Courier-Bold").fontSize(13).fillColor("#0f172a").text(regId, 300, passMetaTop + 18);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("SQUAD / TEAM NAME", 50, passMetaTop + 46);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a").text(team, 50, passMetaTop + 58);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("ALLOCATED HACKING BOOTH", 300, passMetaTop + 46);
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text(booth, 300, passMetaTop + 58);

    // Logistics & Event Window
    const logTop = 235;
    doc.rect(40, logTop, 515, 52).fillAndStroke("#f8fafc", "#cbd5e1");
    doc.moveTo(290, logTop).lineTo(290, logTop + 52).lineWidth(0.5).strokeColor("#cbd5e1").stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("CHALLENGE DOMAIN", 50, logTop + 6);
    doc.font("Helvetica").fontSize(9.5).fillColor("#0f172a").text(track, 50, logTop + 18, { width: 230, ellipsis: true });
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text(`Catering Plan: ${diet}`, 50, logTop + 34);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#64748b").text("CHECK-IN TIME & VENUE", 300, logTop + 6);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("Monday, Dec 15, 2026 @ 09:00 AM IST", 300, logTop + 18);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text("i-Hub Campus Porch, Navrangpura, Ahmedabad", 300, logTop + 34);

    // Scanner Barcode & QR Code
    const passCodeTop = 298;
    doc.rect(40, passCodeTop, 515, 120).fillAndStroke("#ffffff", "#94a3b8");

    if (qrBuf) {
      doc.image(qrBuf, 52, passCodeTop + 10, { width: 100, height: 100 });
      doc.font("Helvetica").fontSize(7).fillColor("#64748b").text("Fast-Track Gate Scan", 52, passCodeTop + 112, { width: 100, align: "center" });
    }

    if (barcodeBuf) {
      doc.image(barcodeBuf, 175, passCodeTop + 18, { width: 250, height: 42 });
    }
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`DIGITAL BADGE CODE: ${regId}`, 175, passCodeTop + 68);
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text("Present this pass on your smartphone or in printed format at the registration desk for badge printing.", 175, passCodeTop + 80, { width: 360 });
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Your allotted booth and power terminals will be activated upon scanning this pass.", 175, passCodeTop + 94, { width: 360 });

    // Competition Schedule Matrix
    const schedTop = 430;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("EVENT SCHEDULE & ROUNDS TIMELINE", 40, schedTop);
    doc.moveTo(40, schedTop + 12).lineTo(555, schedTop + 12).lineWidth(0.5).strokeColor("#0f172a").stroke();

    const timeline = [
      { t: "Dec 15 • 09:00 AM - 11:00 AM", r: "Round 1: Check-in, Badge Printing, Kit Bag Collection & Keynote" },
      { t: "Dec 15 • 11:00 AM", r: "HACKATHON COMMENCES (27.5-Hour Non-stop Sprint Begins)" },
      { t: "Dec 15 • 04:00 PM - 07:00 PM", r: "Round 2: Architecture Review & Mentorship Milestones" },
      { t: "Dec 15 • 08:30 PM", r: "Dinner Buffet & Progress Checkpoint Sign-off" },
      { t: "Dec 16 • 01:30 AM - 04:30 AM", r: "Round 3: Midnight Jury Screening (Bottom 25% Elimination Cut)" },
      { t: "Dec 16 • 09:30 AM", r: "CODE FREEZE: Devpost Repository Submissions Locked" },
      { t: "Dec 16 • 10:30 AM - 12:30 PM", r: "Round 4: Grand Finale Stage Pitches before VC Jury & Awards Handover" },
    ];

    let scY = schedTop + 18;
    timeline.forEach((item) => {
      doc.font("Courier-Bold").fontSize(8).fillColor("#0f172a").text(item.t, 45, scY);
      doc.font("Helvetica").fontSize(8).fillColor("#334155").text(item.r, 220, scY, { width: 320 });
      scY += 15;
    });

    // Mandatory Security Notice
    const warnTop = 550;
    doc.rect(40, warnTop, 515, 60).fillAndStroke("#fcfcfd", "#0f172a");
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0f172a").text("MANDATORY CAMPUS DISQUALIFICATION WARNING", 50, warnTop + 8);
    doc.font("Helvetica").fontSize(8).fillColor("#1e293b").text(
      "The campus gates are sealed throughout the 27.5-hour hackathon. Any participant stepping outside the campus perimeter without authorized written permission from the Chief Warden will be IMMEDIATELY DISQUALIFIED alongside their entire squad with no second chance.",
      50,
      warnTop + 20,
      { width: 495, lineGap: 2 }
    );

    // Signatures
    const passSignTop = 625;
    doc.rect(40, passSignTop, 515, 80).fillAndStroke("#f8fafc", "#cbd5e1");

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("ORGANIZING AUTHORITY", 55, passSignTop + 10);
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#0f172a").text("i-HUB ADMISSIONS & JURY COMMITTEE", 55, passSignTop + 22);
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text("Government of Gujarat Innovation Hub, Ahmedabad", 55, passSignTop + 34);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#059669").text("OFFICIALLY ISSUED BOARDING PASS", 55, passSignTop + 52);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text("HACKER IDENTIFICATION", 330, passSignTop + 10);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text(`NAME: ${name.toUpperCase()}`, 330, passSignTop + 22);
    doc.font("Courier-Bold").fontSize(8.5).fillColor("#0f172a").text(`REF ID: ${regId}`, 330, passSignTop + 36);
    doc.font("Helvetica").fontSize(8).fillColor("#334155").text(`BOOTH: ${booth}`, 330, passSignTop + 50);

    doc.font("Helvetica").fontSize(7).fillColor("#94a3b8").text(`Document Reference: ${regId}-MASTER-PASS • Prajna Puram, Navrangpura, Ahmedabad 380015`, 40, 792, { align: "center", width: 515 });

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
