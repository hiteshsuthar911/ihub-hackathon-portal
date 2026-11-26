const React = require("react");

/**
 * Stage 4 / National Selection Announcement Email Template
 * Formal, institutional format announcing:
 * 1. Nomination to Delhi Innovation & SaaS Acceleration Bootcamp (MeitY)
 * 2. Stage 1 Project-Based Technical Shortlisting & All-India Merit Directive
 */
function NationalCohortSelectionEmail({
  participantName = "SUTHAR HITESH JAGDISH",
  registrationId = "IHUB-2026-6953",
  college = "Thakur College of Engineering and Technology",
  track = "FinTech & Next-Gen Enterprise SaaS",
  projectTitle = "Autonomous Enterprise Fraud Detection & High-Throughput Payment Orchestrator",
  score = "94.5 / 100 (Tier A+)",
  meritRank = "State Merit Rank #04 (Top 1.5% Percentile)",
  meritDispatchDate = "December 22, 2026 at 11:00 AM IST",
  campDates = "January 18, 2027 – January 22, 2027",
  supportEmail = "hackathon@ihubgujarat.in",
}) {
  const cleanName = (participantName || "").replace(/&amp;/g, "&");
  const cleanTrack = (track || "").replace(/&amp;/g, "&");
  const cleanProject = (projectTitle || "").replace(/&amp;/g, "&");
  const cleanCollege = (college || "").replace(/&amp;/g, "&");

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
      React.createElement("title", null, `National Selection & Deputation Order [${registrationId}] - i-Hub Gujarat`),
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
                        backgroundColor: "#1e1b4b",
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
                          textAlign: "center",
                        },
                      },
                      React.createElement(
                        "div",
                        {
                          style: {
                            fontSize: "11px",
                            fontWeight: "700",
                            letterSpacing: "0.08em",
                            color: "#1e293b",
                            textTransform: "uppercase",
                          },
                        },
                        "GOVERNMENT OF GUJARAT & MeitY STARTUP HUB"
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            fontSize: "10.5px",
                            color: "#64748b",
                            marginTop: "3px",
                            letterSpacing: "0.02em",
                          },
                        },
                        "Gujarat Student Startup & Innovation Hub (i-Hub) • National Fellowships Directorate"
                      )
                    )
                  ),

                  // Title Area
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
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    backgroundColor: "#eef2ff",
                                    border: "1px solid #c7d2fe",
                                    color: "#3730a3",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    marginBottom: "12px",
                                  },
                                },
                                "NATIONAL SELECTION & STAGE 1 QUALIFICATION NOTICE"
                              ),
                              React.createElement(
                                "div",
                                {
                                  style: {
                                    fontSize: "20px",
                                    fontWeight: "800",
                                    color: "#0f172a",
                                    margin: "0 0 6px 0",
                                    lineHeight: "1.3",
                                    letterSpacing: "-0.02em",
                                  },
                                },
                                `Official Deputation Order: ${cleanName}`
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
                                `Ref: ${registrationId} • Delhi Innovation & SaaS Acceleration Cohort`
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
                        { style: { margin: "0 0 12px 0" } },
                        `Dear `,
                        React.createElement("strong", null, cleanName),
                        `,`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 12px 0" } },
                        `We are pleased to inform you that following rigorous scrutiny by the Central Technical Evaluation Committee at i-Hub Ahmedabad, your project `,
                        React.createElement("strong", null, `"${cleanProject}"`),
                        ` has successfully cleared `,
                        React.createElement("strong", null, "Stage 1 Project-Based Technical Scrutiny with a composite score of 94.5 / 100 (Tier A+)"),
                        `.`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 12px 0" } },
                        `By virtue of this exemplary evaluation (ranking in the top 1.5% percentile), the Government of Gujarat and MeitY Startup Hub have officially `,
                        React.createElement("strong", null, "deputed you as an Official Innovation Fellow to the New Delhi Innovation & SaaS Acceleration Bootcamp"),
                        ` (January 18–22, 2027) with 100% state sponsorship covering your residential stay, inter-state transit, and $5,000 cloud credits.`
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            padding: "14px 18px",
                            margin: "16px 0",
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { fontSize: "12px", fontWeight: "700", color: "#0f172a", marginBottom: "6px", textTransform: "uppercase" } },
                          "All-India Merit List Directive"
                        ),
                        React.createElement(
                          "div",
                          { style: { fontSize: "12.5px", color: "#334155", lineHeight: "19px" } },
                          `Your project is now entered into the National Innovation Ledger. The consolidated `,
                          React.createElement("strong", null, "All-India National Merit Rank List & Stage 2 VC Pitch Schedule"),
                          ` will be published and dispatched directly to this assigned email address on `,
                          React.createElement("strong", null, meritDispatchDate),
                          `.`
                        )
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "16px 0 6px 0" } },
                        `Attached to this official dispatch are your `,
                        React.createElement("strong", null, "2 gazetted PDF documents"),
                        ` with scannable Code-128 barcodes and audit QR codes:`
                      ),
                      React.createElement(
                        "ol",
                        { style: { margin: "6px 0 0 0", paddingLeft: "18px", fontSize: "13px", lineHeight: "20px", color: "#0f172a" } },
                        React.createElement(
                          "li",
                          { style: { marginBottom: "6px" } },
                          React.createElement("strong", null, "Official Nomination & Deputation Order (Delhi SaaS Camp): "),
                          "Gazetted order confirming your 100% funded fellowship, transit pass, and 5-day curriculum at the MeitY Complex, New Delhi."
                        ),
                        React.createElement(
                          "li",
                          null,
                          React.createElement("strong", null, "Stage 1 Technical Evaluation Verdict & Merit Protocol: "),
                          "Peer-reviewed assessment rubric (94.5/100) and statutory directive regarding the upcoming All-India Merit dispatch."
                        )
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
                            ["FELLOW REFERENCE ID", registrationId, true],
                            ["CANDIDATE NAME", cleanName, false],
                            ["PARENT INSTITUTION", cleanCollege, false],
                            ["INNOVATION TRACK", cleanTrack, false],
                            ["EVALUATION SCORE", score, false],
                            ["MERIT STANDING", meritRank, false],
                            ["DELHI BOOTCAMP DATES", campDates, false],
                            ["ALL-INDIA MERIT DISPATCH", meritDispatchDate, false],
                          ].map(([label, val, isMono], i) =>
                            React.createElement(
                              "tr",
                              {
                                key: label,
                                style: {
                                  backgroundColor: i % 2 === 1 ? "#f8fafc" : "#ffffff",
                                  borderBottom: i < 7 ? "1px solid #e2e8f0" : "none",
                                },
                              },
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "9px 14px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: "#64748b",
                                    width: "42%",
                                    letterSpacing: "0.02em",
                                  },
                                },
                                label
                              ),
                              React.createElement(
                                "td",
                                {
                                  style: {
                                    padding: "9px 14px",
                                    fontSize: isMono ? "12px" : "12.5px",
                                    fontFamily: isMono ? fontMono : fontSans,
                                    fontWeight: isMono ? "700" : "600",
                                    color: isMono ? "#1e1b4b" : "#0f172a",
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

                  // Official Footer
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      {
                        style: {
                          backgroundColor: "#f8fafc",
                          borderTop: "1px solid #e2e8f0",
                          padding: "20px 36px",
                          textAlign: "center",
                          fontSize: "11px",
                          color: "#64748b",
                          lineHeight: "17px",
                        },
                      },
                      React.createElement("div", { style: { fontWeight: "700", color: "#1e293b", marginBottom: "4px" } }, "DIRECTORATE OF INNOVATION & RESEARCH • i-HUB AHMEDABAD"),
                      React.createElement("div", null, "KCG Campus, Opp. PRL, Prajna Puram, Navrangpura, Ahmedabad, Gujarat 380015"),
                      React.createElement(
                        "div",
                        { style: { marginTop: "6px" } },
                        "Assistance: ",
                        React.createElement("a", { href: `mailto:${supportEmail}`, style: { color: "#4f46e5", textDecoration: "underline" } }, supportEmail),
                        " | Central Hotline: +91 79 2630 1234"
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

module.exports = { NationalCohortSelectionEmail };
