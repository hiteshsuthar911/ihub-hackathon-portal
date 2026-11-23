const React = require("react");

/**
 * Hackathon Project Submission Confirmation Email Template
 * Clean, professional light theme.
 * Featuring i-Hub Ahmedabad, Navrangpura.
 */
function HackathonSubmissionEmail({
  participantName = "Dev Hacker",
  teamName = "NeuralVoyage",
  projectName = "AutoAgent Omni-Workflow",
  tagline = "Autonomous multi-agent orchestration for distributed systems",
  track = "AI, Generative Agents & Automation",
  submissionId = "SUB-IHUB-9812",
  timestamp = "Sunday, Dec 14 at 11:42 AM IST",
  githubUrl = "https://github.com/neuralvoyage/autoagent",
  demoUrl = "https://devpost.com/software/autoagent-omni",
  judgingSchedule = "Judging begins at 01:30 PM IST at i-Hub Presentation Hall 2 (Navrangpura, Ahmedabad). Please be at your demo booth 15 mins prior.",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
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
      React.createElement("title", null, `Project Submitted — ${projectName}`),
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

                  // Top Cyan Gradient Bar
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("td", {
                      style: {
                        height: "5px",
                        background: "linear-gradient(90deg, #0284c7 0%, #4f46e5 100%)",
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
                            backgroundColor: "#e0f2fe",
                            border: "1px solid #bae6fd",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            color: "#0369a1",
                            fontFamily: fontSans,
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "🚀 SUBMISSION RECEIVED"
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
                        "Project Successfully Submitted!"
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "4px", color: "#4f46e5", fontSize: "14px", fontWeight: "600" } },
                        `${hackathonName} • i-Hub Ahmedabad`
                      )
                    )
                  ),

                  // Description
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 20px", color: "#334155", fontSize: "15px", lineHeight: "24px" } },
                      React.createElement("p", { style: { margin: "0 0 10px" } }, `Kudos, ${participantName}!`),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Your project `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, projectName),
                        ` has been officially registered with the i-Hub technical evaluation portal. Your materials are now queued for Round 1 jury inspection.`
                      )
                    )
                  ),

                  // Summary Box
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
                                { style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "SUBMISSION REF"),
                                React.createElement("div", { style: { color: "#4f46e5", fontFamily: fontMono, fontSize: "13px", fontWeight: "700", marginTop: "2px" } }, submissionId)
                              ),
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "TEAM"),
                                React.createElement("div", { style: { color: "#0f172a", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, teamName)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { colSpan: 2, style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "TRACK"),
                                React.createElement("div", { style: { color: "#0284c7", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, track)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { colSpan: 2, style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "TAGLINE"),
                                React.createElement("div", { style: { color: "#475569", fontSize: "13px", fontStyle: "italic", marginTop: "2px" } }, `"${tagline}"`)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { colSpan: 2 },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" } }, "TIMESTAMP"),
                                React.createElement("div", { style: { color: "#64748b", fontSize: "12.5px", marginTop: "2px" } }, timestamp)
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Actions
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { align: "center", className: "p-responsive", style: { padding: "0 36px 24px" } },
                      React.createElement(
                        "a",
                        {
                          href: demoUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            marginRight: "8px",
                            marginBottom: "8px",
                          },
                        },
                        "🌐 View Devpost Listing"
                      ),
                      React.createElement(
                        "a",
                        {
                          href: githubUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#ffffff",
                            border: "1.5px solid #cbd5e1",
                            color: "#334155",
                            fontSize: "14px",
                            fontWeight: "600",
                            padding: "11px 20px",
                            borderRadius: "8px",
                            marginBottom: "8px",
                          },
                        },
                        "💻 GitHub Repository"
                      )
                    )
                  ),

                  // Next Step Notice
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
                            backgroundColor: "#eef2ff",
                            border: "1px solid #c7d2fe",
                            borderRadius: "8px",
                            padding: "14px 18px",
                            color: "#3730a3",
                            fontSize: "13px",
                            lineHeight: "20px",
                          },
                        },
                        React.createElement("strong", null, "📢 Next Step: "),
                        judgingSchedule
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
                        `i-Hub Gujarat • Navrangpura, Ahmedabad • Support: `,
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

module.exports = { HackathonSubmissionEmail };
