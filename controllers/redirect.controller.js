const urlModel = require("../models/url.model");
const redirectService = require("../services/redirect.service");
const { NotFoundError } = require("../utils/appError.util");
const { isRealBrowser } = require("../utils/browserReqChecker.util");

module.exports.redirection = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await urlModel.findOne({ shortCode });
    if (!url) {
      throw new NotFoundError("Incorrect ShortCode");
    }

    const ua = req.ua;
    if (isRealBrowser(req, ua.ua)) {
      const ip = req.clientIp;
      await redirectService.redirection({ ua, id: url._id, ip });
      await url.incrementVisitCount();
    }

    let redirectUrl = url.longUrl;
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = "http://" + redirectUrl;
    }
    res.redirect(redirectUrl);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }
    res.render("notfound");
  }
};
