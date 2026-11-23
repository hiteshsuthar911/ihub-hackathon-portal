const React = require("react");

/**
 * Hackathon Acceptance & RSVP Notification Email Template
 * Clean, professional light theme.
 * Featuring i-Hub Ahmedabad, Navrangpura.
 */
function HackathonAcceptanceEmail({
  participantName = "Jordan Hayes",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  rsvpUrl = "https://ihubgujarat.in/hackathon/rsvp?token=rsvp-ack-3921",
  rsvpDeadline = "December 5, 2026 at 11:59 PM IST",
  venue = "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
  eventDate = "December 12 - 14, 2026",
  discordUrl = "https://discord.gg/ihubhackathon",
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
      React.createElement("title", null, `🎉 You're Accepted to ${hackathonName}!`),
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
                    maxWidth: "580px",
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

                  // Top Emerald Gradient Bar
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "5px",
                        background: "linear-gradient(90deg, #10b981 0%, #4f46e5 100%)",
                      },
                    })
                  ),

                  // Header
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "36px 36px 16px" } },
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
                        "🎉 APPLICATION ACCEPTED"
                      ),
                      React.createElement(
                        "h1",
                        {
                          style: {
                            margin: "8px 0 0",
                            color: "#0f172a",
                            fontSize: "26px",
                            fontWeight: "800",
                            lineHeight: "34px",
                          },
                        },
                        `Congratulations, ${participantName}!`
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "4px", color: "#4f46e5", fontSize: "14px", fontWeight: "600" } },
                        `Welcome to ${hackathonName} @ i-Hub Ahmedabad`
                      )
                    )
                  ),

                  // Body
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 20px", color: "#334155", fontSize: "15px", lineHeight: "24px" } },
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 12px" } },
                        `Our technical evaluation jury reviewed hundreds of strong submissions across India, and your application was selected for the in-person hackathon at `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, "i-Hub Navrangpura, Ahmedabad"),
                        `!`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `To guarantee your team's hacking station, mentors, and on-campus accommodation/swag kit, please confirm your RSVP before the deadline.`
                      )
                    )
                  ),

                  // RSVP Notice Card
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 24px" } },
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: "10px",
                            padding: "16px 20px",
                            color: "#9f1239",
                            fontSize: "13.5px",
                            lineHeight: "21px",
                          },
                        },
                        React.createElement("strong", { style: { color: "#be123c" } }, "⚠️ Cutoff Deadline: "),
                        `Please confirm your RSVP before `,
                        React.createElement("strong", null, rsvpDeadline),
                        `. Unconfirmed spots will be rolled over to waitlisted applicants.`
                      )
                    )
                  ),

                  // RSVP Button
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { align: "center", className: "p-responsive", style: { padding: "0 36px 28px" } },
                      React.createElement(
                        "a",
                        {
                          href: rsvpUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#4f46e5",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "700",
                            padding: "14px 36px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
                          },
                        },
                        "✅ Confirm Your RSVP Now"
                      )
                    )
                  ),

                  // Details Breakdown
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
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "18px 20px",
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { marginBottom: "10px" } },
                          React.createElement("span", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "VENUE: "),
                          React.createElement("span", { style: { color: "#0f172a", fontSize: "13.5px", fontWeight: "600", marginLeft: "6px" } }, venue)
                        ),
                        React.createElement(
                          "div",
                          { style: { marginBottom: "10px" } },
                          React.createElement("span", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "DATES: "),
                          React.createElement("span", { style: { color: "#0f172a", fontSize: "13.5px", fontWeight: "600", marginLeft: "6px" } }, eventDate)
                        ),
                        React.createElement(
                          "div",
                          null,
                          React.createElement("span", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "COMMUNITY: "),
                          React.createElement("a", { href: discordUrl, style: { color: "#4f46e5", fontSize: "13.5px", fontWeight: "600", marginLeft: "6px" } }, "Join Participant Discord")
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
                          padding: "20px 36px",
                          borderTop: "1px solid #e2e8f0",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "12px",
                        },
                      },
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `i-Hub Gujarat • Prajna Puram, Navrangpura, Ahmedabad • Questions: `,
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

module.exports = { HackathonAcceptanceEmail };
