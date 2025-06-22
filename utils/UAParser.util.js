const UAParser = require("ua-parser-js");
const { LRUCache } = require("lru-cache");

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24,
});

const ua = (req, res, next) => {
  const uaString = req.headers["user-agent"] || "Unknown";

  if (cache.has(uaString)) {
    req.ua = cache.get(uaString);
  } else {
    const parser = new UAParser(uaString);
    const parsed = parser.getResult();
    cache.set(uaString, parsed);
    req.ua = parsed;
  }
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
