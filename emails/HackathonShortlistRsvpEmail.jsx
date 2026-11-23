const React = require("react");

/**
 * Stage 4: Shortlist Notification & 2-Step Secured RSVP Verification Email
 * Contains unique one-time secured RSVP URL requiring Registration ID + Email
 */
function HackathonShortlistRsvpEmail({
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "NeuralVoyage",
  track = "AI, Generative Agents & Automation",
  rsvpUrl = "http://localhost:3000/rsvp?token=SAMPLE_TOKEN",
  rsvpDeadline = "December 5, 2026 at 06:00 PM IST",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  venue = "i-Hub Campus, Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015",
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
      React.createElement("title", null, `Action Required: Shortlisted for ${hackathonName}`),
      React.createElement(
        "style",
        null,
        `
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: ${fontSans}; -webkit-font-smoothing: antialiased; }
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
      { style: { margin: 0, padding: 0, backgroundColor: "#f8fafc" } },
      React.createElement(
        "table",
        {
          width: "100%",
          cellPadding: 0,
          cellSpacing: 0,
          border: 0,
          style: { backgroundColor: "#f8fafc", padding: "36px 12px" },
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

                  // Top Emerald/Blue Accent Line
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "5px",
                        background: "linear-gradient(90deg, #10b981 0%, #2563eb 50%, #4f46e5 100%)",
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
                                "STAGE 4: SHORTLIST & SECURED RSVP"
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
                                "You're Shortlisted for i-Hub Gujarat!"
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
                                "Congratulations! Your project proposal has been shortlisted. Please confirm your physical attendance using the secured 2-step verification portal below."
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

                  // Body Content
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "24px 36px" } },

                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: "0 0 16px 0",
                            fontSize: "15px",
                            lineHeight: "1.6",
                            color: "#334155",
                          },
                        },
                        `Dear `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, participantName),
                        `,`
                      ),
                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: "0 0 20px 0",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            color: "#475569",
                          },
                        },
                        `The evaluation jury at `,
                        React.createElement("strong", null, "i-Hub Ahmedabad (Navrangpura)"),
                        ` has reviewed your application and shortlisted your team `,
                        React.createElement("strong", null, `"${teamName}"`),
                        ` under track `,
                        React.createElement("strong", null, track),
                        `.`
                      ),

                      // Verification Gate Callout
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "10px",
                            padding: "18px 20px",
                            marginBottom: "24px",
                          },
                        },
                        React.createElement(
                          "div",
                          {
                            style: {
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#166534",
                              marginBottom: "6px",
                            },
                          },
                          "🔒 2-PAGE SECURED RSVP PROCESS"
                        ),
                        React.createElement(
                          "p",
                          {
                            style: {
                              margin: "0 0 10px 0",
                              fontSize: "13px",
                              color: "#15803d",
                              lineHeight: "1.5",
                            },
                          },
                          "To prevent unauthorized confirmations, accessing your RSVP form requires a 2-step verification security check:"
                        ),
                        React.createElement(
                          "ol",
                          {
                            style: {
                              margin: 0,
                              paddingLeft: "18px",
                              fontSize: "12px",
                              color: "#166534",
                              lineHeight: "1.6",
                            },
                          },
                          React.createElement(
                            "li",
                            null,
                            React.createElement("strong", null, "Step 1 (Security Gate):"),
                            ` Enter your unique Registration ID (`,
                            React.createElement("code", { style: { fontFamily: fontMono, color: "#0f172a" } }, registrationId),
                            `) and registered email address.`
                          ),
                          React.createElement(
                            "li",
                            null,
                            React.createElement("strong", null, "Step 2 (Final Attendance):"),
                            " Re-confirm arrival time, overnight hackathon pledge, and laptop serial."
                          )
                        )
                      ),

                      // Credentials Box
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
                            padding: "14px 18px",
                            marginBottom: "24px",
                          },
                        },
                        React.createElement(
                          "tbody",
                          null,
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              { style: { fontSize: "12px", color: "#64748b", paddingBottom: "6px" } },
                              "YOUR REGISTRATION NUMBER"
                            ),
                            React.createElement(
                              "td",
                              { align: "right", style: { fontSize: "12px", color: "#64748b", paddingBottom: "6px" } },
                              "RSVP DEADLINE"
                            )
                          ),
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              {
                                style: {
                                  fontSize: "16px",
                                  fontWeight: 800,
                                  fontFamily: fontMono,
                                  color: "#2563eb",
                                },
                              },
                              registrationId
                            ),
                            React.createElement(
                              "td",
                              {
                                align: "right",
                                style: {
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  color: "#b91c1c",
                                },
                              },
                              rsvpDeadline
                            )
                          )
                        )
                      ),

                      // RSVP Button
                      React.createElement(
                        "table",
                        { width: "100%", cellPadding: 0, cellSpacing: 0, border: 0, style: { marginBottom: "24px" } },
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
                                "a",
                                {
                                  href: rsvpUrl,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  style: {
                                    display: "inline-block",
                                    backgroundColor: "#2563eb",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    fontSize: "15px",
                                    padding: "14px 32px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    letterSpacing: "0.02em",
                                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                                  },
                                },
                                "Open Secured RSVP Portal →"
                              )
                            )
                          ),
                          React.createElement(
                            "tr",
                            null,
                            React.createElement(
                              "td",
                              { align: "center", style: { paddingTop: "10px" } },
                              React.createElement(
                                "span",
                                { style: { fontSize: "11px", color: "#94a3b8" } },
                                "Secured Single-Use Link • Expires upon confirmation"
                              )
                            )
                          )
                        )
                      ),

                      // Strict Anti-Exit Warning
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
                          React.createElement("strong", null, "⚠️ Mandatory Attendance Policy: "),
                          "Failure to RSVP before the deadline will result in your seat being allocated to waitlisted participants. Once checked into i-Hub Navrangpura, leaving campus during the 36-hour sprint without warden clearance results in immediate disqualification."
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
                        `Questions? Reach out to `,
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

module.exports = { HackathonShortlistRsvpEmail };
