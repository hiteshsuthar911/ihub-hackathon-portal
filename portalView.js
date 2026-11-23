const fs = require("fs");
const path = require("path");

const PORTAL_HTML_PATH = path.join(__dirname, "portal.html");

function getPortalHtml() {
  return fs.readFileSync(PORTAL_HTML_PATH, "utf-8");
}

module.exports = { getPortalHtml };
