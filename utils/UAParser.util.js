const UAParser = require("ua-parser-js");

const ua = (req, res, next) => {
  const parser = new UAParser();
  const ua = req.headers["user-agent"] || "Unknown";
  req.ua = parser.setUA(ua).getResult();
  next();
};

function inferDeviceTypeFromOS(ua) {
  const osName = ua.os.name?.toLowerCase() || "";
  if (
    osName.includes("windows") ||
    osName.includes("mac") ||
    osName.includes("linux")
  ) {
    return "desktop";
  }
  if (osName.includes("ios") || osName.includes("android")) {
    return "mobile";
  }
  return "unknown";
}

const normalizeBrowserName = (name = "") => {
  return name.replace(/^(Mobile|Tablet)\s/i, "").trim();
};

const retriver = async (ua) => {
  const browser = normalizeBrowserName(ua.browser.name || "Unknown");

  const os = ua.os.name || "Unknown";

  const device = inferDeviceTypeFromOS(ua);

  return {
    browser,
    os,
    device,
  };
};

module.exports = { ua, retriver };
