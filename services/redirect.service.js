const axios = require("axios");
const { retriver } = require("../utils/UAParser.util");
const clickModel = require("../models/click.model");

const redirection = async ({ ua, ip, id }) => {
  const { browser, os, device } = await retriver(ua);
  const ipContent = await axios.get(
    `http://ip-api.com/json/${ip}?fields=1106169`
  );
  await clickModel.create({
    url: id,
    ipAddress: ip,
    continent: ipContent.data.continent || "Unknown",
    country: ipContent.data.country || "Unknown",
    state: ipContent.data.regionName || "Unknown",
    city: ipContent.data.city || "Unknown",
    location: {
      ltd: ipContent.data.lat,
      lng: ipContent.data.lon,
    },
    browser: browser || "Unknown",
    os: os,
    device: device || "Unknown",
    userAgent: ua.ua || "Unknown",
  });
  return;
};

module.exports = { redirection };
