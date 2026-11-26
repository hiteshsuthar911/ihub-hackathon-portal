const React = require("react");

/**
 * Stage 3: Registration Confirmation & Comprehensive Dossier Email Template
 * Clean, formal, institutional format without gaudy colors or emojis.
 * Sent with 4 official PDF attachments:
 * 1. Registration Receipt
 * 2. Food & Catering Coupon Pass
 * 3. Security & Anti-Exit Undertaking
 * 4. Parental / Guardian Approval Form
 */
function HackathonDossierEmail({
  participantName = "Alex Rivera",
  registrationId = "IHUB-2026-9842",
  teamName = "Solo",
  track = "AI, Generative Agents & Automation",
  foodPreference = "Pure Vegetarian",
  parentName = "Rajesh Rivera",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  venue = "i-Hub Campus, Prajna Puram, Opp. PRL, Navrangpura, Ahmedabad 380015",
  supportEmail = "hackathon@ihubgujarat.in",
}) {
  const cleanName = (participantName || "").replace(/&amp;/g, "&");
  const cleanTrack = (track || "").replace(/&amp;/g, "&");
  const cleanTeam = (teamName || "").replace(/&amp;/g, "&");
  const cleanFood = (foodPreference || "").replace(/&amp;/g, "&");

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
      React.createElement("title", null, `Registration Confirmed [${registrationId}] - ${hackathonName}`),
      React.createElement(
        "style",
        null,
        `
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: ${fontSans}; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; }
        a { text-decoration: none; }
        @media only screen and (max-width: 600px) {
          .email-card { width: 100% !important; border-radius: 6px !important; }
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
          style: { backgroundColor: "#f8fafc", padding: "32px 12px" },
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
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                  },
                },
                React.createElement(
                  "tbody",
                  null,

                  // Subtle Institutional Header Bar
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "4px",
                        backgroundColor: "#0f172a",
                      },
                    })
                  ),

                  // Institutional Sub-header
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      {
                        style: {
                          backgroundColor: "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
                          padding: "16px 36px",
                          textAlign: "left",
                        },
                      },
                      React.createElement(
                        "div",
                        {
                          style: {
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#475569",
                          },
                        },
                        "GOVERNMENT OF GUJARAT • i-HUB AHMEDABAD"
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#0f172a",
                            marginTop: "2px",
                          },
                        },
                        "Student Startup & Innovation Hub • Admissions Cell"
                      )
                    )
                  ),

                  // Header
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "28px 36px 16px 36px" } },
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
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    color: "#0f172a",
                                    backgroundColor: "#f1f5f9",
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    marginBottom: "10px",
                                    border: "1px solid #cbd5e1",
                                  },
                                },
                                "REGISTRATION DOSSIER CONFIRMED"
                              ),
                              React.createElement(
                                "h1",
                                {
                                  style: {
                                    margin: "0 0 6px 0",
                                    fontSize: "21px",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    lineHeight: "1.3",
                                    letterSpacing: "-0.02em",
                                  },
                                },
                                `Registration Confirmed: ${cleanName}`
                              ),
                              React.createElement(
                                "div",
                                {
                                  style: {
                                    fontSize: "12px",
                                    fontFamily: fontMono,
                                    color: "#475569",
                                    marginTop: "2px",
                                  },
                                },
                                `Reference ID: ${registrationId} • ${hackathonName}`
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
                      React.createElement("div", { style: { height: "1px", backgroundColor: "#e2e8f0" } })
                    )
                  ),

                  // Body Statement
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "20px 36px 16px 36px", color: "#334155", fontSize: "14px", lineHeight: "22px" } },
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 10px 0" } },
                        `Your formal registration for the `,
                        React.createElement("strong", null, hackathonName),
                        ` has been successfully authenticated by the Admissions and Proctorial Board at i-Hub Ahmedabad (Navrangpura).`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: 0 } },
                        `Attached to this email are your `,
                        React.createElement("strong", null, "4 official registration documents (PDF)"),
                        ` generated with security barcodes and verification QR codes:`
                      ),
                      React.createElement(
                        "ol",
                        { style: { margin: "10px 0 0 0", paddingLeft: "18px", fontSize: "13px", lineHeight: "20px", color: "#0f172a" } },
                        React.createElement("li", null, React.createElement("strong", null, "Official Registration Receipt: "), "Applicant identification and entry reference."),
                        React.createElement("li", null, React.createElement("strong", null, "Catering & Meal Coupon Pass: "), "Designated food plan with scheduled on-campus dining slots."),
                        React.createElement("li", null, React.createElement("strong", null, "Campus Security & Anti-Exit Undertaking: "), "Strict proctorial protocol agreement."),
                        React.createElement("li", null, React.createElement("strong", null, "Parental / Guardian Consent Form: "), "Authorization record for on-campus overnight presence.")
                      )
                    )
                  ),

                  // Metadata Table
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 20px 36px" } },
                      React.createElement(
                        "table",
                        {
                          width: "100%",
                          cellPadding: 0,
                          cellSpacing: 0,
                          border: 0,
                          style: {
                            backgroundColor: "#fcfcfd",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            overflow: "hidden",
                          },
                        },
                        React.createElement(
                          "tbody",
                          null,
                          [
                            ["REGISTRATION NUMBER", registrationId, true],
                            ["PARTICIPANT NAME", cleanName, false],
                            ["SQUAD / TEAM FORMAT", cleanTeam, false],
                            ["CHALLENGE DOMAIN", cleanTrack, false],
                            ["CATERING PREFERENCE", cleanFood, false],
                            ["EVENT TIMINGS", "Dec 15, 09:00 AM – Dec 16, 12:30 PM", false],
                            ["VENUE LOCATION", venue, false],
                          ].map(([label, val, isMono], i) =>
                            React.createElement(
                              "tr",
                              {
                                key: i,
                                style: {
                                  borderBottom: i < 6 ? "1px solid #e2e8f0" : "none",
                                },
                              },
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "10px 14px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#475569",
                                    width: "38%",
                                    backgroundColor: "#f8fafc",
                                    borderRight: "1px solid #e2e8f0",
                                  },
                                },
                                label
                              ),
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "10px 14px",
                                    fontSize: "12.5px",
                                    fontWeight: isMono ? 800 : 600,
                                    fontFamily: isMono ? fontMono : fontSans,
                                    color: "#0f172a",
                                  },
                                },
                                val
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Strict Campus Security Warning Block
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 24px 36px" } },
                      React.createElement(
                        "div",
                        {
                          style: {
                            border: "1px solid #94a3b8",
                            borderRadius: "6px",
                            padding: "14px 16px",
                            backgroundColor: "#f8fafc",
                          },
                        },
                        React.createElement(
                          "div",
                          {
                            style: {
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: "#0f172a",
                              marginBottom: "4px",
                            },
                          },
                          "CAMPUS BOUNDARY & SECURITY NOTICE"
                        ),
                        React.createElement(
                          "p",
                          {
                            style: {
                              margin: 0,
                              fontSize: "11.5px",
                              lineHeight: "18px",
                              color: "#334155",
                            },
                          },
                          "During the 27.5-hour event window (Dec 15, 09:00 AM – Dec 16, 12:30 PM), all participants must remain within the designated i-Hub campus perimeter. Exiting the gates without prior written approval from the Chief Security Officer and Event Warden results in ",
                          React.createElement("strong", null, "immediate permanent disqualification"),
                          " of the candidate and team squad without right of appeal."
                        )
                      )
                    )
                  ),

                  // Attachments Note
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      {
                        style: {
                          backgroundColor: "#f8fafc",
                          borderTop: "1px solid #e2e8f0",
                          padding: "14px 36px",
                          fontSize: "11.5px",
                          color: "#475569",
                        },
                      },
                      "4 PDF Documents Attached: Registration-Receipt.pdf, Food-Coupon-Pass.pdf, Security-Undertaking.pdf, Parental-Guardian-Consent.pdf"
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
                          backgroundColor: "#ffffff",
                          borderTop: "1px solid #cbd5e1",
                          padding: "20px 36px",
                          textAlign: "center",
                        },
                      },
                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: "0 0 4px 0",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            color: "#0f172a",
                          },
                        },
                        "i-Hub Event Cell • Gujarat Student Startup & Innovation Hub"
                      ),
                      React.createElement(
                        "p",
                        {
                          style: {
                            margin: "0 0 6px 0",
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
                            fontSize: "10.5px",
                            color: "#94a3b8",
                          },
                        },
                        `Official Inquiries: `,
                        React.createElement(
                          "a",
                          { href: `mailto:${supportEmail}`, style: { color: "#0f172a", textDecoration: "underline" } },
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

module.exports = { HackathonDossierEmail };
