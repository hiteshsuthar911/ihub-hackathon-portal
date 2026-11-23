const PDFDocument = require("pdfkit");

/**
 * Generates an official Hackathon Participant Badge / Ticket PDF as a Buffer.
 * Clean, professional white & light theme.
 * Featuring i-Hub Ahmedabad, Navrangpura.
 *
 * @param {object} data
 * @param {string} data.participantName
 * @param {string} data.registrationId
 * @param {string} data.teamName
 * @param {string} data.track
 * @param {string} data.hackathonName
 * @param {string} data.eventDate
 * @param {string} data.venue
 * @returns {Promise<Buffer>}
 */
function generateHackathonPass(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const name = data.participantName || "Alex Rivera";
    const regId = data.registrationId || "IHUB-2026-9842";
    const team = data.teamName || "NeuralVoyage";
    const track = data.track || "AI, Generative Agents & Automation";
    const hackathon = data.hackathonName || "i-Hub Gujarat Innovation Hackathon 2026";
    const dates = data.eventDate || "December 12 - 14, 2026 (36 Hours)";
    const venue = data.venue || "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015";

    // ── Outer Background (Crisp Light Slate) ──
    doc.rect(0, 0, 595.28, 841.89).fill("#f1f5f9");

    // ── Main Card (Pure White with subtle border) ──
    doc.roundedRect(36, 40, 523, 760, 12).fillAndStroke("#ffffff", "#cbd5e1");

    // Top Header Banner
    doc.roundedRect(36, 40, 523, 85, 12).fill("#1e1b4b");
    doc.rect(36, 110, 523, 15).fill("#1e1b4b"); // square off bottom corners of top banner

    // Top Banner Accent Bar
    doc.rect(36, 40, 523, 4).fill("#4f46e5");

    // Header Content
    doc.fillColor("#a5b4fc").fontSize(9).font("Helvetica-Bold").text("GOVERNMENT OF GUJARAT // i-HUB AHMEDABAD", 56, 56);
    doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold").text("INNOVATION HACKATHON 2026", 56, 72);
    doc.fillColor("#34d399").fontSize(10).font("Helvetica-Bold").text("OFFICIAL PARTICIPANT BADGE", 360, 74, { align: "right", width: 180 });

    // ── Participant Primary Info Section ──
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("PARTICIPANT NAME", 56, 145);
    doc.fillColor("#0f172a").fontSize(20).font("Helvetica-Bold").text(name, 56, 160);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("REGISTRATION / PASS ID", 360, 145);
    doc.fillColor("#4338ca").fontSize(18).font("Courier-Bold").text(regId, 360, 160);

    // Row 2: Team & Track
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("ASSIGNED SQUAD / TEAM", 56, 205);
    doc.fillColor("#334155").fontSize(14).font("Helvetica-Bold").text(team, 56, 220);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("CHALLENGE TRACK", 360, 205);
    doc.fillColor("#0284c7").fontSize(13).font("Helvetica-Bold").text(track, 360, 220);

    // Row 3: Event Dates & Venue
    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("EVENT DATES & TIMELINE", 56, 260);
    doc.fillColor("#0f172a").fontSize(12).font("Helvetica").text(dates, 56, 275);

    doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("VENUE LOCATION", 56, 305);
    doc.fillColor("#334155").fontSize(11).font("Helvetica").text(venue, 56, 320, { width: 480 });

    // ── Barcode & Check-in Verification Box ──
    doc.roundedRect(56, 360, 483, 70, 8).fillAndStroke("#f8fafc", "#e2e8f0");
    doc.fillColor("#64748b").fontSize(8).font("Courier-Bold").text("ON-CAMPUS CHECK-IN VERIFICATION CODE", 72, 372);
    doc.fillColor("#4338ca").fontSize(18).font("Courier-Bold").text(`|| | |||| | ||| | || ${regId} || | |||| |||`, 72, 388, { characterSpacing: 2 });
    doc.fillColor("#64748b").fontSize(8).font("Helvetica").text("Present this pass at the i-Hub Navrangpura registration desk for badge verification & swag kit collection.", 72, 414);

    // ── Participant Guidelines ──
    doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text("PARTICIPANT GUIDELINES & PROTOCOLS", 56, 455);
    doc.moveTo(56, 472).lineTo(539, 472).strokeColor("#e2e8f0").lineWidth(1).stroke();

    const rules = [
      "1. Venue & Check-in: Physical reporting at i-Hub, Navrangpura, Ahmedabad by 08:30 AM on Day 1. Please carry a valid Gov ID.",
      "2. Infrastructure & WiFi: High-speed fiber network and power outlets will be allocated per team table. Cloud sponsor credits provided.",
      "3. 36-Hour Hackathon: Food, snacks, beverages, and rest zones are provided on-campus throughout the 36-hour sprint.",
      "4. Fresh Code Policy: All project code must be developed during the event. Open-source libraries, APIs, and frameworks are allowed.",
      "5. Final Evaluation: Devpost submissions close at 11:00 AM on Day 3 followed by presentation before the state jury.",
    ];

    let yPos = 485;
    rules.forEach((rule) => {
      doc.fillColor("#334155").fontSize(9.5).font("Helvetica").text(rule, 56, yPos, { width: 480, lineGap: 3 });
      yPos += 26;
    });

    // ── Emergency & Helpdesk ──
    doc.roundedRect(56, 630, 483, 55, 6).fill("#f1f5f9");
    doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("i-HUB HELPDESK & EMERGENCY HOTLINE", 72, 642);
    doc.fillColor("#0f172a").fontSize(9).font("Helvetica").text("Venue: Navrangpura, Ahmedabad  |  Helpline: +91 79 2630 0000  |  Email: hackathon@ihubgujarat.in", 72, 658);

    // ── Footer ──
    doc.fillColor("#94a3b8").fontSize(8).font("Helvetica").text(
      `Issued by i-Hub Gujarat (Student Startup & Innovation Hub) • Navrangpura, Ahmedabad. Pass Ref: ${regId}`,
      56,
      765,
      { align: "center", width: 483 }
    );

    doc.end();
  });
}

module.exports = { generateHackathonPass };
