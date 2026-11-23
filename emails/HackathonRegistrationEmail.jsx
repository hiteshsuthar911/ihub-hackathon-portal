const React = require("react");

/**
 * Hackathon Registration Confirmation & Participant Pass Email Template
 * Clean, professional, elegant light theme.
 * Venue: i-Hub Ahmedabad, Navrangpura, Gujarat.
 */
function HackathonRegistrationEmail({
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "NeuralVoyage",
  track = "AI, Generative Agents & Automation",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  eventDate = "December 12 - 14, 2026",
  venue = "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
  checkInTime = "Friday, Dec 12 at 08:30 AM IST",
  discordUrl = "https://discord.gg/ihubhackathon",
  guideUrl = "https://ihubgujarat.in/hackathon/handbook",
  calendarUrl = "https://ihubgujarat.in/calendar.ics",
  prizePool = "₹10,00,000+",
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
      React.createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      }),
      React.createElement("title", null, `${hackathonName} — Registration Confirmed`),
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
          .hero-title { font-size: 24px !important; line-height: 32px !important; }
          .ticket-row td { display: block !important; width: 100% !important; }
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

              // Main White Card
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

                  // Top Indigo Gradient Bar
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "5px",
                        background: "linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)",
                      },
                    })
                  ),

                  // Header Section
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "36px 36px 18px", textAlign: "left" } },
                      React.createElement(
                        "span",
                        {
                          style: {
                            display: "inline-block",
                            backgroundColor: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            color: "#065f46",
                            fontFamily: fontSans,
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "✓ REGISTRATION CONFIRMED"
                      ),
                      React.createElement(
                        "h1",
                        {
                          className: "hero-title",
                          style: {
                            margin: "8px 0 0",
                            color: "#0f172a",
                            fontSize: "26px",
                            fontWeight: "800",
                            lineHeight: "34px",
                            letterSpacing: "-0.5px",
                          },
                        },
                        `You're In, ${participantName}!`
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            marginTop: "6px",
                            color: "#4f46e5",
                            fontSize: "14px",
                            fontWeight: "600",
                          },
                        },
                        `${hackathonName} • i-Hub Navrangpura, Ahmedabad`
                      )
                    )
                  ),

                  // Intro
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 24px", color: "#334155", fontSize: "15px", lineHeight: "24px" } },
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Your registration has been successfully confirmed. Below is your official participant check-in pass for `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, "i-Hub Ahmedabad"),
                        `. Please present this pass or its attached PDF at the on-campus desk during check-in.`
                      )
                    )
                  ),

                  // Digital Participant Pass Card (Light Professional Style)
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 26px" } },
                      React.createElement(
                        "table",
                        {
                          width: "100%",
                          cellPadding: 0,
                          cellSpacing: 0,
                          border: 0,
                          style: {
                            backgroundColor: "#f8fafc",
                            border: "1.5px solid #cbd5e1",
                            borderRadius: "12px",
                            overflow: "hidden",
                          },
                        },
                        React.createElement(
                          "tbody",
                          null,
                          // Pass Header Strip
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              {
                                style: {
                                  backgroundColor: "#f1f5f9",
                                  padding: "12px 20px",
                                  borderBottom: "1px solid #e2e8f0",
                                },
                              },
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
                                      { style: { color: "#475569", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" } },
                                      "i-HUB OFFICIAL PARTICIPANT PASS"
                                    ),
                                    React.createElement(
                                      "td",
                                      { align: "right", style: { color: "#4f46e5", fontFamily: fontMono, fontSize: "12px", fontWeight: "700" } },
                                      registrationId
                                    )
                                  )
                                )
                              )
                            )
                          ),
                          // Pass Content Details
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              { style: { padding: "20px" } },
                              React.createElement(
                                "table",
                                { width: "100%", cellPadding: 0, cellSpacing: 0, border: 0 },
                                React.createElement(
                                  "tbody",
                                  null,
                                  React.createElement(
                                    "tr",
                                    { className: "ticket-row" },
                                    React.createElement(
                                      "td",
                                      { width: "50%", style: { paddingBottom: "14px" } },
                                      React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "PARTICIPANT"),
                                      React.createElement("div", { style: { color: "#0f172a", fontSize: "15px", fontWeight: "700", marginTop: "2px" } }, participantName)
                                    ),
                                    React.createElement(
                                      "td",
                                      { width: "50%", style: { paddingBottom: "14px" } },
                                      React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "TEAM"),
                                      React.createElement("div", { style: { color: "#4f46e5", fontSize: "15px", fontWeight: "700", marginTop: "2px" } }, teamName || "Solo")
                                    )
                                  ),
                                  React.createElement(
                                    "tr",
                                    { className: "ticket-row" },
                                    React.createElement(
                                      "td",
                                      { width: "50%", style: { paddingBottom: "14px" } },
                                      React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "CHALLENGE TRACK"),
                                      React.createElement("div", { style: { color: "#0284c7", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, track)
                                    ),
                                    React.createElement(
                                      "td",
                                      { width: "50%", style: { paddingBottom: "14px" } },
                                      React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "CHECK-IN TIME"),
                                      React.createElement("div", { style: { color: "#0f172a", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, checkInTime)
                                    )
                                  ),
                                  React.createElement(
                                    "tr",
                                    null,
                                    React.createElement(
                                      "td",
                                      { colSpan: 2 },
                                      React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "VENUE LOCATION"),
                                      React.createElement("div", { style: { color: "#334155", fontSize: "13px", fontWeight: "500", marginTop: "2px", lineHeight: "19px" } }, venue)
                                    )
                                  )
                                )
                              )
                            )
                          ),
                          // Barcode / Check-in Aesthetic Strip
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              {
                                align: "center",
                                style: {
                                  backgroundColor: "#f1f5f9",
                                  padding: "10px 20px",
                                  borderTop: "1px dashed #cbd5e1",
                                },
                              },
                              React.createElement(
                                "span",
                                {
                                  style: {
                                    fontFamily: fontMono,
                                    fontSize: "12px",
                                    letterSpacing: "4px",
                                    color: "#475569",
                                    fontWeight: "600",
                                  },
                                },
                                `|| | |||| | ||| | || ${registrationId} || | |||| | |||`
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Action Buttons
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { align: "center", className: "p-responsive", style: { padding: "0 36px 28px" } },
                      React.createElement(
                        "a",
                        {
                          href: discordUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#4f46e5",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            padding: "13px 26px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                            marginRight: "10px",
                            marginBottom: "10px",
                          },
                        },
                        "💬 Join Hacker Discord"
                      ),
                      React.createElement(
                        "a",
                        {
                          href: guideUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#ffffff",
                            border: "1.5px solid #cbd5e1",
                            color: "#334155",
                            fontSize: "14px",
                            fontWeight: "600",
                            padding: "12px 22px",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          },
                        },
                        "📖 Participant Handbook"
                      )
                    )
                  ),

                  // Schedule Table
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 28px" } },
                      React.createElement(
                        "div",
                        {
                          style: {
                            color: "#0f172a",
                            fontSize: "13px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            marginBottom: "12px",
                            textTransform: "uppercase",
                          },
                        },
                        "⏱️ Schedule Highlights @ i-Hub"
                      ),
                      React.createElement(
                        "table",
                        { width: "100%", cellPadding: 0, cellSpacing: 0, border: 0 },
                        React.createElement(
                          "tbody",
                          null,
                          [
                            { time: "Day 1 • 08:30 AM", event: "On-campus Check-in & Breakfast (i-Hub Navrangpura)" },
                            { time: "Day 1 • 10:00 AM", event: "Keynote, Problem Statements & Hacking Begins" },
                            { time: "Day 2 • 02:00 PM", event: "Mentor Review & Prototype Checkpoint" },
                            { time: "Day 3 • 11:00 AM", event: "Project Freeze & Submission on Devpost" },
                            { time: "Day 3 • 02:30 PM", event: "Jury Presentation, Grand Finale & Awards" },
                          ].map((item, idx) =>
                            React.createElement(
                              "tr",
                              { key: idx },
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f1f5f9",
                                    fontFamily: fontMono,
                                    fontSize: "12px",
                                    color: "#4f46e5",
                                    fontWeight: "600",
                                    width: "140px",
                                  },
                                },
                                item.time
                              ),
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f1f5f9",
                                    fontSize: "13px",
                                    color: "#334155",
                                  },
                                },
                                item.event
                              )
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
                          padding: "24px 36px",
                          borderTop: "1px solid #e2e8f0",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "12px",
                        },
                      },
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 6px", color: "#334155", fontWeight: "600" } },
                        `i-Hub Gujarat • Prajna Puram, Navrangpura, Ahmedabad, Gujarat 380015`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Queries? Contact the organizing committee at `,
                        React.createElement("a", { href: `mailto:${supportEmail}`, style: { color: "#4f46e5" } }, supportEmail)
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

module.exports = { HackathonRegistrationEmail };
