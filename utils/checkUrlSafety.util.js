const axios = require("axios");

const checkUrlSafety = async (url, first = false) => {
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
      console.error("Safe Browsing API error:", error.message);
    }
    if (!first) {
      return await checkUrlSafety(url, true);
    }
    return true;
  }
};

module.exports = { checkUrlSafety };
