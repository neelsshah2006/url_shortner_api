const axios = require("axios");
const { retriver } = require("../utils/UAParser.util");
const clickModel = require("../models/click.model");
const { AppError } = require("../utils/appError.util");

const redirection = async ({ ua, ip, id }) => {
  try {
    const { browser, os, device } = await retriver(ua);
    const ipRes = await axios.get(
      `http://ip-api.com/json/${ip}?fields=1106169`
    );

    const ipData = ipRes.data || {};
    await clickModel.create({
      url: id,
      ipAddress: ip,
      continent: ipData.continent || "Unknown",
      country: ipData.country || "Unknown",
      state: ipData.regionName || "Unknown",
      city: ipData.city || "Unknown",
      location: {
        ltd: ipData.lat || 0,
        lng: ipData.lon || 0,
      },
      browser: browser || "Unknown",
      os: os || "Unknown",
      device: device || "Unknown",
      userAgent: ua?.ua || "Unknown",
    });

    return;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Redirection error:", err.message);
    }
    throw new AppError("Failed to log click or retrieve IP data.", 500);
  }
};

module.exports = { redirection };
