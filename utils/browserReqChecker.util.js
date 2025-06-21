const isRealBrowser = (req, ua) => {
  const lowerUA = ua.toLowerCase();

  const botUserAgents = [
    "bot",
    "spider",
    "crawl",
    "discord",
    "slack",
    "twitterbot",
    "telegrambot",
    "whatsapp",
    "facebookexternalhit",
    "preview",
    "curl",
    "wget",
    "python-requests",
    "favicon",
  ];
  if (botUserAgents.some((bot) => lowerUA.includes(bot))) return false;
  const acceptHeader = req.headers["accept"] || "";
  if (!acceptHeader.includes("text/html")) return false;

  return true;
};

module.exports = {
  isRealBrowser,
};
