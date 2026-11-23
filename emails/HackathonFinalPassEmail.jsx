const React = require("react");

/**
 * Stage 5: Final Confirmation & Master Hacker Boarding Pass Email
 * Sent upon successful completion of the 2-step RSVP form.
 * Contains minute-by-minute schedule, emergency numbers, booth number,
 * and attached IHUB-Master-Hacker-Boarding-Pass.pdf.
 */
function HackathonFinalPassEmail({
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "NeuralVoyage",
  track = "AI, Generative Agents & Automation",
  boothNumber = "Lab 3 - Table B-14",
  foodPreference = "Pure Vegetarian",
  checkInTime = "Monday, Dec 15, 2026 @ 09:00 AM IST",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  venue = "i-Hub Campus, Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015",
  emergencyContact = "+91 79 2630 0000 / +91 98765 43210",
  supportEmail = "hackathon@ihubgujarat.in",
}) {
  const fontSans =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const fontMono =
    '"SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace';

  return React.createElement(
    "html",
    { lang: "en" },
    React.createElement(
      "head",
      null,
      React.createElement("meta", { charSet: "utf-8" }),
      React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      React.createElement("title", null, `FINAL BOARDING PASS: ${hackathonName} [${registrationId}]`),
      React.createElement(
        "style",
        null,
        `
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: ${fontSans}; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
        a { text-decoration: none; }
        @media only screen and (max-width: 600px) {
          .email-card { width: 100% !important; border-radius: 8px !important; }
          .p-responsive { padding: 24px 20px !important; }
        }
      `
      )
    ),
    React.createElement(
      "body",
      { style: { margin: 0, padding: 0, backgroundColor: "#f1f5f9" } },
      React.createElement(
        "table",
        {
          width: "100%",
          cellPadding: 0,
          cellSpacing: 0,
          border: 0,
          style: { backgroundColor: "#f1f5f9", padding: "36px 12px" },
        },
        React.createElement(
          "tbody",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { align: "center" },

              React.createElement(
                "table",
                {
                  className: "email-card",
                  width: "100%",
                  cellPadding: 0,
                  cellSpacing: 0,
                  border: 0,
                  style: {
                    maxWidth: "600px",
                    backgroundColor: "#ffffff",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                  },
                },
                React.createElement(
                  "tbody",
                  null,

                  // Top Gold/Emerald Badge
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "6px",
                        background: "linear-gradient(90deg, #10b981 0%, #059669 40%, #0d9488 100%)",
                      },
                    })
                  ),

                  // Header
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "32px 36px 20px 36px" } },
                      React.createElement(
                        "table",
                        { width: "100%", cellPadding: 0, cellSpacing: 0, border: 0 },
                        React.createElement(
                          "tbody",
                          null,
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              null,
                              React.createElement(
                                "div",
                                {
                                  style: {
                                    display: "inline-block",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "#047857",
                                    backgroundColor: "#ecfdf5",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    marginBottom: "12px",
                                    border: "1px solid #a7f3d0",
                                  },
                                },
                                "STAGE 5: FINAL OFFICIAL BOARDING PASS"
                              ),
                              React.createElement(
                                "h1",
                                {
                                  style: {
                                    margin: "0 0 6px 0",
                                    fontSize: "23px",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    lineHeight: "1.3",
                                  },
                                },
                                "You Are Cleared for Hackathon Entry!"
                              ),
                              React.createElement(
                                "p",
                                {
                                  style: {
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#64748b",
                                    lineHeight: "1.5",
                                  },
                                },
                                `Attendance confirmed for ${participantName}. Your Official Hacker Pass is attached to this email.`
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Divider
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { style: { padding: "0 36px" } },
                      React.createElement("div", { style: { height: "1px", backgroundColor: "#f1f5f9" } })
                    )
                  ),

                  // Pass Banner
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "24px 36px" } },

                      // Hacker Boarding Pass Card
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#0f172a",
                            color: "#ffffff",
                            borderRadius: "12px",
                            padding: "24px",
                            marginBottom: "24px",
                            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.2)",
                          },
                        },
                        React.createElement(
                          "div",
                          {
                            style: {
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #334155",
                              paddingBottom: "12px",
                              marginBottom: "16px",
                            },
                          },
                          React.createElement(
                            "div",
                            null,
                            React.createElement(
                              "span",
                              { style: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" } },
                              "HACKER PASS ID"
                            ),
                            React.createElement(
                              "div",
                              { style: { fontSize: "18px", fontWeight: 800, fontFamily: fontMono, color: "#38bdf8" } },
                              registrationId
                            )
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right" } },
                            React.createElement(
                              "span",
                              { style: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" } },
                              "ALLOCATED BOOTH"
                            ),
                            React.createElement(
                              "div",
                              { style: { fontSize: "14px", fontWeight: 700, color: "#34d399" } },
                              boothNumber
                            )
                          )
                        ),
                        React.createElement(
                          "table",
                          { width: "100%", cellPadding: 0, cellSpacing: 0, border: 0 },
                          React.createElement(
                            "tbody",
                            null,
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "10px" } },
                                React.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "PARTICIPANT"),
                                React.createElement("div", { style: { fontSize: "15px", fontWeight: 700 } }, participantName)
                              ),
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "10px", textAlign: "right" } },
                                React.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "TEAM SQUAD"),
                                React.createElement("div", { style: { fontSize: "15px", fontWeight: 700 } }, teamName)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                null,
                                React.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "FOOD PLAN"),
                                React.createElement("div", { style: { fontSize: "13px", color: "#facc15", fontWeight: 600 } }, foodPreference)
                              ),
                              React.createElement(
                                "td",
                                { style: { textAlign: "right" } },
                                React.createElement("div", { style: { fontSize: "11px", color: "#94a3b8" } }, "CHECK-IN GATE"),
                                React.createElement("div", { style: { fontSize: "12px", color: "#e2e8f0" } }, "Main Porch (Navrangpura)")
                              )
                            )
                          )
                        )
                      ),

                      // Schedule Timeline
                      React.createElement(
                        "h3",
                        {
                          style: {
                            margin: "0 0 14px 0",
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#0f172a",
                          },
                        },
                        "⏱️ 27.5-Hour Minute-by-Minute Schedule (Dec 15 - 16)"
                      ),
                      React.createElement(
                        "table",
                        {
                          width: "100%",
                          cellPadding: 0,
                          cellSpacing: 0,
                          border: 0,
                          style: {
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            marginBottom: "24px",
                          },
                        },
                        React.createElement(
                          "tbody",
                          null,
                          [
                            { time: "Dec 15, 09:00 AM", event: "Security Gate Clearance & Biometric Check-in" },
                            { time: "Dec 15, 10:30 AM", event: "Keynote & Problem Statements Released" },
                            { time: "Dec 15, 11:00 AM", event: "ROUND 1: HACKING COMMENCES (Sprint Clock Starts)" },
                            { time: "Dec 15, 04:30 PM", event: "ROUND 2: Architecture & Mentorship Review" },
                            { time: "Dec 15, 08:30 PM", event: "Dinner & Mentor Progress Sign-off" },
                            { time: "Dec 16, 02:00 AM", event: "ROUND 3: Midnight Jury Screening (Elimination Cut)" },
                            { time: "Dec 16, 09:30 AM", event: "HACKATHON CODE FREEZE (Devpost Submissions Locked)" },
                            { time: "Dec 16, 10:30 AM", event: "ROUND 4: Grand Pitching Finale before VC Jury" },
                            { time: "Dec 16, 12:30 PM", event: "Awards Ceremony & ₹10L+ Grants Handover" },
                          ].map((item, idx) =>
                            React.createElement(
                              "tr",
                              { key: idx },
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "6px 0",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    fontFamily: fontMono,
                                    color: "#2563eb",
                                    width: "40%",
                                  },
                                },
                                item.time
                              ),
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "6px 0",
                                    fontSize: "12px",
                                    color: "#334155",
                                  },
                                },
                                item.event
                              )
                            )
                          )
                        )
                      ),

                      // What to Bring Checklist
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            borderRadius: "8px",
                            padding: "16px",
                            marginBottom: "24px",
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { fontSize: "13px", fontWeight: 700, color: "#0369a1", marginBottom: "8px" } },
                          "🎒 MANDATORY PHYSICAL CHECK-IN REQUIREMENTS"
                        ),
                        React.createElement(
                          "ul",
                          { style: { margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#0c4a6e", lineHeight: "1.6" } },
                          React.createElement("li", null, "Attached PDF Master Hacker Pass (printed or on phone)."),
                          React.createElement("li", null, "Original Government Photo ID (Aadhaar / Voter ID / Passport) + College ID."),
                          React.createElement("li", null, "Personal Laptop, charger, extension cords, and hardware peripherals."),
                          React.createElement("li", null, "Signed Physical Copy of Parental Consent Form (if staying overnight).")
                        )
                      ),

                      // Anti-Exit Disqualification Warning
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "14px 16px",
                            marginBottom: "20px",
                          },
                        },
                        React.createElement(
                          "p",
                          {
                            style: {
                              margin: 0,
                              fontSize: "12px",
                              lineHeight: "1.5",
                              color: "#991b1b",
                            },
                          },
                          React.createElement("strong", null, "🚨 ZERO TOLERANCE CAMPUS LEAVING RULE: "),
                          "Participants are strictly prohibited from stepping out of the i-Hub Navrangpura campus during the 36-hour sprint. Security gates will verify your badge upon every entry. Anyone found leaving without Chief Warden written permission is automatically disqualified immediately."
                        )
                      ),

                      // Emergency Contacts
                      React.createElement(
                        "table",
                        { width: "100%", cellPadding: 0, cellSpacing: 0, border: 0 },
                        React.createElement(
                          "tbody",
                          null,
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              { style: { fontSize: "12px", color: "#64748b" } },
                              "Emergency Help Desk:"
                            ),
                            React.createElement(
                              "td",
                              { align: "right", style: { fontSize: "12px", fontWeight: 700, color: "#0f172a" } },
                              emergencyContact
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Footer
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      {
                        style: {
                          backgroundColor: "#f8fafc",
                          borderTop: "1px solid #e2e8f0",
                          padding: "24px 36px",
                          textAlign: "center",
                        },
                      },
                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: "0 0 6px 0",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#334155",
                          },
                        },
                        "i-Hub Event Cell • Gujarat Student Startup & Innovation Hub"
                      ),
                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: "0 0 8px 0",
                            fontSize: "11px",
                            color: "#64748b",
                          },
                        },
                        venue
                      ),
                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: 0,
                            fontSize: "11px",
                            color: "#94a3b8",
                          },
                        },
                        `Official Contact: `,
                        React.createElement(
                          "a",
                          { href: `mailto:${supportEmail}`, style: { color: "#2563eb" } },
                          supportEmail
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

module.exports = { HackathonFinalPassEmail };
