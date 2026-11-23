const React = require("react");

/**
 * Hackathon Application Announcement & Call for Innovators Email Template
 * Clean, modern, professional light theme.
 * Featuring i-Hub Ahmedabad, Navrangpura.
 */
function HackathonApplicationInviteEmail({
  recipientName = "Innovator",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  organizer = "i-Hub (Gujarat Student Startup & Innovation Hub)",
  venue = "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
  eventDates = "December 12 - 14, 2026",
  applicationDeadline = "November 30, 2026 at 11:59 PM IST",
  applyUrl = "https://ihubgujarat.in/hackathon/apply",
  guideUrl = "https://ihubgujarat.in/hackathon/guidelines",
  prizePool = "₹10,00,000+ & Incubation Grants",
  tracks = [
    "AI, Generative Agents & Automation",
    "Smart Cities & Urban Mobility",
    "FinTech & Next-Gen Digital Payments",
    "AgriTech & Climate Solutions",
    "Healthcare & DeepTech Innovations",
  ],
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
      React.createElement("title", null, `Apply Now — ${hackathonName} @ i-Hub Ahmedabad`),
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

              // Main Card
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

                  // Top Indigo Gradient Accent
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
                      { className: "p-responsive", style: { padding: "36px 36px 20px", textAlign: "left" } },
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
                            marginBottom: "14px",
                          },
                        },
                        "🚀 APPLICATIONS NOW OPEN"
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
                        `Apply for ${hackathonName}`
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            marginTop: "6px",
                            color: "#6366f1",
                            fontSize: "14px",
                            fontWeight: "600",
                          },
                        },
                        `📍 In-Person @ i-Hub, Navrangpura, Ahmedabad`
                      )
                    )
                  ),

                  // Personal Pitch
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 24px", color: "#334155", fontSize: "15px", lineHeight: "24px" } },
                      React.createElement("p", { style: { margin: "0 0 14px" } }, `Hello ${recipientName},`),
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 14px" } },
                        `We are thrilled to invite you to submit your application for `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, hackathonName),
                        `, Gujarat’s premier 36-hour physical hackathon hosted at the state-of-the-art `,
                        React.createElement("strong", { style: { color: "#4f46e5" } }, "i-Hub Ahmedabad facility in Navrangpura"),
                        `.`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Whether you're building solo or with a team of up to 4 innovators, this is your platform to design scalable prototypes, receive expert mentorship from industry leaders, and compete for `,
                        React.createElement("strong", { style: { color: "#059669" } }, prizePool),
                        `.`
                      )
                    )
                  ),

                  // Key Highlights Box
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
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "VENUE LOCATION"),
                                React.createElement("div", { style: { color: "#0f172a", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, venue)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "12px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "EVENT DATES"),
                                React.createElement("div", { style: { color: "#0f172a", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" } }, `${eventDates} (36 Hours On-Campus)`)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                null,
                                React.createElement("div", { style: { color: "#dc2626", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "APPLICATION DEADLINE"),
                                React.createElement("div", { style: { color: "#b91c1c", fontSize: "13.5px", fontWeight: "700", marginTop: "2px" } }, applicationDeadline)
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Challenge Themes
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 26px" } },
                      React.createElement(
                        "div",
                        {
                          style: {
                            color: "#0f172a",
                            fontSize: "13px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "10px",
                          },
                        },
                        "💡 Innovation Challenge Tracks"
                      ),
                      React.createElement(
                        "div",
                        { style: { color: "#475569", fontSize: "13.5px", lineHeight: "22px" } },
                        tracks.map((t, i) =>
                          React.createElement(
                            "div",
                            { key: i, style: { padding: "3px 0" } },
                            `✓ ${t}`
                          )
                        )
                      )
                    )
                  ),

                  // Apply CTA Button
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { align: "center", className: "p-responsive", style: { padding: "0 36px 32px" } },
                      React.createElement(
                        "a",
                        {
                          href: applyUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          style: {
                            display: "inline-block",
                            backgroundColor: "#4f46e5",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "700",
                            padding: "14px 34px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
                            marginRight: "10px",
                            marginBottom: "10px",
                          },
                        },
                        "🚀 Apply for Hackathon at i-Hub"
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
                            padding: "13px 22px",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          },
                        },
                        "📖 View Guidelines"
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
                          lineHeight: "18px",
                        },
                      },
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 6px", fontWeight: "600", color: "#334155" } },
                        `${organizer} • Navrangpura, Ahmedabad, Gujarat`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Need assistance or have queries? Email us at `,
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

module.exports = { HackathonApplicationInviteEmail };
