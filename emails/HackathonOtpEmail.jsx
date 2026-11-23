const React = require("react");

/**
 * Hackathon Hacker Verification OTP Email Template
 * Clean, professional light theme.
 * Featuring i-Hub Ahmedabad, Navrangpura.
 */
function HackathonOtpEmail({
  participantName = "Hacker",
  code = "729 415",
  expiresInMinutes = 10,
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
      React.createElement("title", null, `${code} is your ${hackathonName} verification code`),
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
                    maxWidth: "520px",
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

                  // Indigo Top Bar
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
                      { className: "p-responsive", style: { padding: "36px 36px 16px" } },
                      React.createElement(
                        "span",
                        {
                          style: {
                            display: "inline-block",
                            backgroundColor: "#eef2ff",
                            border: "1px solid #c7d2fe",
                            borderRadius: "20px",
                            padding: "4px 12px",
                            color: "#4338ca",
                            fontFamily: fontSans,
                            fontSize: "12px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "🔐 PORTAL VERIFICATION"
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
                        "Verify your Hacker Account"
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "4px", color: "#4f46e5", fontSize: "13px", fontWeight: "600" } },
                        `${hackathonName} • i-Hub Navrangpura`
                      )
                    )
                  ),

                  // Body
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 20px", color: "#334155", fontSize: "14.5px", lineHeight: "22px" } },
                      React.createElement("p", { style: { margin: "0 0 10px" } }, `Hey ${participantName},`),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Use the verification code below to verify your email address on the `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, hackathonName),
                        ` portal.`
                      )
                    )
                  ),

                  // OTP Box (Clean light design)
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { align: "center", className: "p-responsive", style: { padding: "0 36px 24px" } },
                      React.createElement(
                        "div",
                        {
                          style: {
                            backgroundColor: "#f8fafc",
                            border: "2px solid #c7d2fe",
                            borderRadius: "12px",
                            padding: "20px 24px",
                            textAlign: "center",
                          },
                        },
                        React.createElement(
                          "div",
                          {
                            style: {
                              fontFamily: fontMono,
                              fontSize: "36px",
                              fontWeight: "800",
                              letterSpacing: "8px",
                              color: "#4338ca",
                            },
                          },
                          code
                        ),
                        React.createElement(
                          "div",
                          { style: { marginTop: "8px", color: "#64748b", fontSize: "12px" } },
                          `⏱️ Code expires in ${expiresInMinutes} minutes`
                        )
                      )
                    )
                  ),

                  // Warning
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 28px" } },
                      React.createElement(
                        "p",
                        { style: { margin: "0", color: "#64748b", fontSize: "12px", lineHeight: "18px" } },
                        "If you did not initiate this request, someone may have entered your email address by mistake. You can safely ignore this email."
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
                          padding: "18px 36px",
                          borderTop: "1px solid #e2e8f0",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "11.5px",
                        },
                      },
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `i-Hub Gujarat • Prajna Puram, Navrangpura, Ahmedabad • `,
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

module.exports = { HackathonOtpEmail };
