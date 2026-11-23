const React = require("react");

/**
 * Hackathon Team Invitation Email Template
 * Clean, professional light theme.
 * Featuring i-Hub Ahmedabad, Navrangpura.
 */
function HackathonTeamInviteEmail({
  inviteeName = "Dev Hacker",
  inviterName = "Elena Rostova",
  teamName = "CyberSynthetics",
  track = "AI, Generative Agents & Automation",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  venue = "i-Hub Ahmedabad, Navrangpura, Ahmedabad",
  inviteUrl = "https://ihubgujarat.in/team/invite?token=invite-9821-tok",
  expiresInHours = 48,
  teamMembers = ["Elena Rostova (Lead)", "Kavita Rao", "Marcus Vance"],
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
      React.createElement("title", null, `Team Invitation — ${teamName} at ${hackathonName}`),
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

                  // Top Amber/Indigo Gradient Bar
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "5px",
                        background: "linear-gradient(90deg, #f59e0b 0%, #4f46e5 100%)",
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
                            backgroundColor: "#fef3c7",
                            border: "1px solid #fde68a",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            color: "#92400e",
                            fontFamily: fontSans,
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "🤝 TEAM SQUAD INVITATION"
                      ),
                      React.createElement(
                        "h1",
                        {
                          style: {
                            margin: "8px 0 0",
                            color: "#0f172a",
                            fontSize: "24px",
                            fontWeight: "800",
                            lineHeight: "32px",
                          },
                        },
                        `Join Team "${teamName}"`
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "4px", color: "#4f46e5", fontSize: "13.5px", fontWeight: "600" } },
                        `${hackathonName} • ${venue}`
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
                      React.createElement("p", { style: { margin: "0 0 12px" } }, `Hi ${inviteeName},`),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        React.createElement("strong", { style: { color: "#0f172a" } }, inviterName),
                        ` has invited you to join team `,
                        React.createElement("strong", { style: { color: "#4f46e5" } }, `"${teamName}"`),
                        ` for the upcoming hackathon at `,
                        React.createElement("strong", null, "i-Hub Ahmedabad, Navrangpura"),
                        ` under the `,
                        React.createElement("strong", { style: { color: "#0284c7" } }, track),
                        ` track.`
                      )
                    )
                  ),

                  // Team Roster Box
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
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "18px 20px",
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" } },
                          `CURRENT TEAM ROSTER (${teamMembers.length}/4 MEMBERS)`
                        ),
                        React.createElement(
                          "div",
                          { style: { color: "#1e293b", fontSize: "14px", lineHeight: "22px" } },
                          teamMembers.map((m, idx) =>
                            React.createElement(
                              "div",
                              { key: idx, style: { padding: "3px 0" } },
                              `• ${m}`
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Accept CTA Button
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { align: "center", className: "p-responsive", style: { padding: "8px 36px 28px" } },
                      React.createElement(
                        "a",
                        {
                          href: inviteUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#059669",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "700",
                            padding: "13px 34px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
                          },
                        },
                        "🚀 Accept Team Invitation"
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "12px", color: "#64748b", fontSize: "12px" } },
                        `⏰ This invitation link expires in ${expiresInHours} hours.`
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
                        `i-Hub Gujarat • Navrangpura, Ahmedabad • Questions: `,
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

module.exports = { HackathonTeamInviteEmail };
