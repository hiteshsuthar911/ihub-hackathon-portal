const React = require("react");

/**
 * Hackathon Application Announcement & Call for Innovators Email Template
 * Clean, modern, professional light theme.
 * Schedule: 15th Morning 09:00 AM to 16th Afternoon 12:30 PM
 * Complete multi-round milestone structure & strict disqualification rules.
 */
function HackathonApplicationInviteEmail({
  recipientName = "Innovator",
  hackathonName = "i-Hub Gujarat Innovation Hackathon 2026",
  organizer = "i-Hub (Gujarat Student Startup & Innovation Hub)",
  venue = "i-Hub Ahmedabad, Prajna Puram, KCG Campus, Opp. PRL, Navrangpura, Ahmedabad, Gujarat 380015",
  eventDates = "December 15, 09:00 AM – December 16, 12:30 PM",
  applicationDeadline = "December 10, 2026 at 11:59 PM IST",
  applyUrl = "http://localhost:3000/portal",
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
          .hero-title { font-size: 23px !important; line-height: 30px !important; }
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
                      { className: "p-responsive", style: { padding: "36px 36px 16px", textAlign: "left" } },
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
                            fontSize: "11.5px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                          },
                        },
                        "🚀 OFFICIAL CALL FOR INNOVATORS • DEC 15 - 16"
                      ),
                      React.createElement(
                        "h1",
                        {
                          className: "hero-title",
                          style: {
                            margin: "6px 0 0",
                            color: "#0f172a",
                            fontSize: "25px",
                            fontWeight: "800",
                            lineHeight: "33px",
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
                            color: "#4f46e5",
                            fontSize: "13.5px",
                            fontWeight: "700",
                          },
                        },
                        `📍 In-Person @ i-Hub Campus, Navrangpura, Ahmedabad`
                      )
                    )
                  ),

                  // Event Overview
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "td",
                      { className: "p-responsive", style: { padding: "0 36px 20px", color: "#334155", fontSize: "14.5px", lineHeight: "23px" } },
                      React.createElement("p", { style: { margin: "0 0 12px" } }, `Hello `, React.createElement("strong", { style: { color: "#0f172a" } }, recipientName), `,`),
                      React.createElement(
                        "p",
                        { style: { margin: "0 0 12px" } },
                        `You are officially invited to register for the flagship `,
                        React.createElement("strong", { style: { color: "#0f172a" } }, hackathonName),
                        `. The hackathon will run non-stop from `,
                        React.createElement("strong", { style: { color: "#4f46e5" } }, "December 15 (09:00 AM) to December 16 (12:30 PM)"),
                        ` at i-Hub Navrangpura, Ahmedabad.`
                      ),
                      React.createElement(
                        "p",
                        { style: { margin: "0" } },
                        `Whether applying `,
                        React.createElement("strong", null, "Solo"),
                        ` or as a `,
                        React.createElement("strong", null, "Team Squad (up to 4 members)"),
                        `, you will navigate rigorous milestone elimination rounds judged by top industry architects, with a prize pool of `,
                        React.createElement("strong", { style: { color: "#059669" } }, prizePool),
                        `.`
                      )
                    )
                  ),

                  // Key Timings Banner
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
                                { style: { paddingBottom: "10px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "TIMINGS & DURATION"),
                                React.createElement("div", { style: { color: "#0f172a", fontSize: "14px", fontWeight: "700", marginTop: "2px" } }, "Dec 15, 09:00 AM → Dec 16, 12:30 PM (27.5 Hours Non-Stop)")
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                { style: { paddingBottom: "10px" } },
                                React.createElement("div", { style: { color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "VENUE LOCATION"),
                                React.createElement("div", { style: { color: "#334155", fontSize: "13px", fontWeight: "600", marginTop: "2px" } }, venue)
                              )
                            ),
                            React.createElement(
                              "tr",
                              null,
                              React.createElement(
                                "td",
                                null,
                                React.createElement("div", { style: { color: "#dc2626", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" } }, "PORTAL REGISTRATION DEADLINE"),
                                React.createElement("div", { style: { color: "#b91c1c", fontSize: "13.5px", fontWeight: "700", marginTop: "2px" } }, applicationDeadline)
                              )
                            )
                          )
                        )
                      )
                    )
                  ),

                  // Hackathon Rounds & Elimination Architecture
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
                            color: "#0f172a",
                            fontSize: "13px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "12px",
                          },
                        },
                        "📊 4-STAGE COMPETITION ROUNDS & TIMELINE"
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            overflow: "hidden",
                          },
                        },
                        [
                          {
                            round: "ROUND 1: Check-in, Security Verification & Kickoff",
                            time: "Dec 15 • 09:00 AM - 11:00 AM",
                            desc: "Biometric badge scanning, laptop security serial clearance, kit bag collection, and keynote problem statement reveal.",
                            status: "Mandatory Entry",
                            color: "#2563eb",
                          },
                          {
                            round: "ROUND 2: Architecture & Mentorship Evaluation",
                            time: "Dec 15 • 04:00 PM - 07:00 PM",
                            desc: "Teams present their system architecture and early prototype code to assigned industry mentors. Scoring cutoff applies.",
                            status: "Milestone Check",
                            color: "#0891b2",
                          },
                          {
                            round: "ROUND 3: Midnight Jury Screening (Elimination Cut)",
                            time: "Dec 16 • 01:30 AM - 04:30 AM",
                            desc: "Jury evaluates GitHub commits, API integrations, and functioning backend logic. Bottom 25% teams disqualified from finals.",
                            status: "Elimination Round",
                            color: "#d97706",
                          },
                          {
                            round: "ROUND 4: Grand Pitching Finale & Code Freeze",
                            time: "Dec 16 • 09:30 AM - 12:30 PM",
                            desc: "Code freeze at 09:30 AM. Top shortlisted finalists pitch on main stage to jury & VC fund managers. Winner declaration at 12:30 PM.",
                            status: "Final Jury Stage",
                            color: "#059669",
                          },
                        ].map((r, i) =>
                          React.createElement(
                            "div",
                            {
                              key: i,
                              style: {
                                padding: "14px 16px",
                                borderBottom: i < 3 ? "1px solid #f1f5f9" : "none",
                                backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                              },
                            },
                            React.createElement(
                              "div",
                              { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" } },
                              React.createElement("strong", { style: { fontSize: "13px", color: "#0f172a" } }, r.round),
                              React.createElement(
                                "span",
                                {
                                  style: {
                                    fontSize: "10.5px",
                                    fontWeight: "700",
                                    color: r.color,
                                    backgroundColor: "#ffffff",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    border: `1px solid ${r.color}33`,
                                  },
                                },
                                r.status
                              )
                            ),
                            React.createElement("div", { style: { fontSize: "11.5px", fontFamily: fontMono, color: "#64748b", marginBottom: "4px" } }, r.time),
                            React.createElement("div", { style: { fontSize: "12px", color: "#475569", lineHeight: "17px" } }, r.desc)
                          )
                        )
                      )
                    )
                  ),

                  // Strict Disqualification Rules Box
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
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "10px",
                            padding: "16px 18px",
                          },
                        },
                        React.createElement(
                          "div",
                          {
                            style: {
                              fontSize: "12.5px",
                              fontWeight: "800",
                              color: "#991b1b",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: "8px",
                            },
                          },
                          "🚨 ZERO TOLERANCE DISQUALIFICATION POLICY"
                        ),
                        React.createElement(
                          "ul",
                          {
                            style: {
                              margin: 0,
                              paddingLeft: "18px",
                              fontSize: "12px",
                              color: "#7f1d1d",
                              lineHeight: "19px",
                            },
                          },
                          React.createElement(
                            "li",
                            null,
                            React.createElement("strong", null, "Unauthorized Campus Exit: "),
                            "Stepping outside the i-Hub Navrangpura campus gates between Dec 15 09:00 AM and Dec 16 12:30 PM without Chief Warden written pass results in ",
                            React.createElement("strong", null, "immediate disqualification"),
                            " and permanent blacklist. No second chances are granted."
                          ),
                          React.createElement(
                            "li",
                            null,
                            React.createElement("strong", null, "Pre-written Code: "),
                            "All code, designs, and models must be initialized fresh during the event window. Repositories with prior commits are flagged and barred from Round 3."
                          ),
                          React.createElement(
                            "li",
                            null,
                            React.createElement("strong", null, "Parental/Guardian Consent: "),
                            "Overnight presence requires a verified signed parental approval form on file."
                          )
                        )
                      )
                    )
                  ),

                  // Tracks Box
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
                            color: "#0f172a",
                            fontSize: "12.5px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "8px",
                          },
                        },
                        "💡 Innovation Challenge Tracks"
                      ),
                      React.createElement(
                        "div",
                        { style: { color: "#475569", fontSize: "13px", lineHeight: "20px" } },
                        tracks.map((t, i) =>
                          React.createElement("div", { key: i, style: { padding: "2px 0" } }, `✓ ${t}`)
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
                            fontFamily: fontSans,
                            fontSize: "15px",
                            fontWeight: "700",
                            padding: "14px 34px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                          },
                        },
                        "Register on Secured Portal →"
                      ),
                      React.createElement(
                        "div",
                        { style: { marginTop: "10px", fontSize: "12px", color: "#64748b" } },
                        "Solo Hackers & Team Squads Welcome • Meal & Overnight Pass Provided"
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
                            fontWeight: "700",
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
                          { href: `mailto:${supportEmail}`, style: { color: "#4f46e5" } },
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

module.exports = { HackathonApplicationInviteEmail };
