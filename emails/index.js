const { render } = require("@react-email/render");
const React = require("react");

// ── i-Hub Ahmedabad Hackathon Email Templates ──
const { HackathonApplicationInviteEmail } = require("./HackathonApplicationInviteEmail.jsx");
const { HackathonRegistrationEmail }      = require("./HackathonRegistrationEmail.jsx");
const { HackathonTeamInviteEmail }        = require("./HackathonTeamInviteEmail.jsx");
const { HackathonAcceptanceEmail }        = require("./HackathonAcceptanceEmail.jsx");
const { HackathonSubmissionEmail }        = require("./HackathonSubmissionEmail.jsx");
const { HackathonOtpEmail }               = require("./HackathonOtpEmail.jsx");
const { HackathonDossierEmail }           = require("./HackathonDossierEmail.jsx");
const { HackathonShortlistRsvpEmail }     = require("./HackathonShortlistRsvpEmail.jsx");
const { HackathonFinalPassEmail }         = require("./HackathonFinalPassEmail.jsx");

/**
 * Render a React Email component to HTML and plain-text fallback.
 * @param {React.ComponentType} Component
 * @param {object} props
 * @returns {Promise<{ html: string, text: string }>}
 */
async function renderEmail(Component, props = {}) {
  const element = React.createElement(Component, props);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  return { html, text };
}

module.exports = {
  HackathonApplicationInviteEmail,
  HackathonRegistrationEmail,
  HackathonTeamInviteEmail,
  HackathonAcceptanceEmail,
  HackathonSubmissionEmail,
  HackathonOtpEmail,
  HackathonDossierEmail,
  HackathonShortlistRsvpEmail,
  HackathonFinalPassEmail,
  renderEmail,
};
