const axios = require("axios");
const { AppError, BadRequestError } = require("./appError.util");

const checkUrlSafety = async (url, first = false) => {
  if (!url || typeof url !== "string") {
    throw new BadRequestError("Invalid URL provided.");
  }
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  const body = {
    client: {
      clientId: process.env.GOOGLE_SAFE_BROWSING_CLIENT_ID,
      clientVersion: process.env.GOOGLE_SAFE_BROWSING_CLIENT_VERSION,
    },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }],
    },
  };

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      body
    );

    if (response.data && response.data.matches) {
      return false;
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      if (error.response) {
        console.error("Safe Browsing API response error:", error.response.data);
      } else if (error.request) {
        console.error("Safe Browsing API no response received:", error.request);
      } else {
        console.error("Safe Browsing API error:", error.message);
      }
    }
    if (!first) {
      return await checkUrlSafety(url, true);
    }
    throw new AppError("Failed to check URL safety. External API error.", 503);
  }
};

module.exports = { checkUrlSafety };
