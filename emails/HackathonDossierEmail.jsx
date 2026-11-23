const React = require("react");

/**
 * Stage 3: Registration Confirmation & Comprehensive Dossier Email Template
 * Sent immediately after portal registration with all 4 PDF attachments:
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
      React.createElement("title", null, `Registration Confirmed [${registrationId}] — ${hackathonName}`),
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

                  // Top Indigo Gradient
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

                  // Header
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "36px 36px 18px" } },
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
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "✓ REGISTRATION DOSSIER CONFIRMED"
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
                        `Thank You for Registering, ${participantName}!`
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "6px", color: "#4f46e5", fontSize: "14px", fontWeight: "600" } },
                        `Registration Ref: ${registrationId} • ${hackathonName}`
                      )
                    )
                  ),

                  // Intro
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 20px", color: "#334155", fontSize: "15px", lineHeight: "24px" } },
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 12px" } },
                        `Your application for the 36-hour physical hackathon at `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, "i-Hub Ahmedabad (Navrangpura)"),
                        ` has been successfully received and validated by the admissions committee.`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Attached to this email are your `,
                        React.createElement("strong", null, "4 official registration documents"),
                        `: your registration receipt, food & catering coupons, signed campus security protocol undertaking, and parental consent record.`
                      )
                    )
                  ),

                  // Summary Grid Box
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
                            border: "1.5px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "20px",
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
                                { style: { paddingBottom: "12px", width: "50%" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "REGISTRATION ID"),
                                React.createElement("div", { style: { color: "#4f46e5", fontFamily: fontMono, fontSize: "14px", fontWeight: "700", marginTop: "2px" } }, registrationId)
                              ),
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "12px", width: "50%" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "SQUAD / TEAM"),
                                React.createElement("div", { style: { color: "#0f172a", fontSize: "14px", fontWeight: "700", marginTop: "2px" } }, teamName)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "CHALLENGE TRACK"),
                                React.createElement("div", { style: { color: "#0284c7", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, track)
                              ),
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "FOOD PREFERENCE"),
                                React.createElement("div", { style: { color: "#059669", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, foodPreference)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { colSpan: 2 },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "CAMPUS VENUE"),
                                React.createElement("div", { style: { color: "#334155", fontSize: "12.5px", marginTop: "2px" } }, venue)
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Strict Security Alert Box
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
                            border: "1.5px solid #fecdd3",
                            borderRadius: "10px",
                            padding: "16px 20px",
                            color: "#9f1239",
                            fontSize: "13px",
                            lineHeight: "20px",
                          },
                        },
                        React.createElement("strong", { style: { color: "#be123c", display: "block", marginBottom: "4px" } }, "🛡️ STRICT CAMPUS SECURITY BOUNDARY CLAUSE:"),
                        "During the 36-hour sprint, stepping outside the i-Hub premises without authorized written Security Marshal permission will result in ",
                        React.createElement("strong", null, "IMMEDIATE PERMANENT DISQUALIFICATION"),
                        " of the candidate and team with NO second chance."
                      )
                    )
                  ),

                  // PDF Attachments Checklist
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
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "📎 4 Official PDF Documents Attached"
                      ),
                      React.createElement(
                        "div",
                        { style: { color: "#475569", fontSize: "13px", lineHeight: "22px" } },
                        [
                          "1. Official Registration Summary Receipt (.pdf)",
                          "2. 36-Hour Meal & Food Coupon Pass (.pdf)",
                          "3. Campus Security Undertaking & Zero-Tolerance Policy (.pdf)",
                          "4. Signed Parental / Guardian Approval Form (.pdf)",
                        ].map((docItem, idx) =>
                          React.createElement(
                            "div",
                            { key: idx, style: { padding: "4px 0", color: "#334155" } },
                            React.createElement("span", { style: { color: "#4f46e5", fontWeight: "700" } }, "📄 "),
                            docItem
                          )
                        )
                      )
                    )
                  ),

                  // Next Step Note
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
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "8px",
                            padding: "14px 18px",
                            color: "#1e40af",
                            fontSize: "13px",
                            lineHeight: "20px",
                          },
                        },
                        React.createElement("strong", null, "What Happens Next: "),
                        "Our review panel will evaluate submissions. If shortlisted, you will receive a secure attendance confirmation link to finalize your on-campus presence and receive your Official Hacker Boarding Pass."
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
                      React.createElement("p", { style: { margin: "0 0 6px", color: "#334155", fontWeight: "600" } }, "i-Hub Event Cell • Prajna Puram, Navrangpura, Ahmedabad 380015"),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        "Questions or modifications? Email us at ",
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

module.exports = { HackathonDossierEmail };
