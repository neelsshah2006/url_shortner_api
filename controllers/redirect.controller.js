const urlModel = require("../models/url.model");

module.exports.redirection = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await urlModel.findOne({ shortCode });
    if (!url) {
      throw new Error("Incorrect ShortCode");
    }

    await url.incrementVisitCount();

    let redirectUrl = url.longUrl;
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = "http://" + redirectUrl;
    }
    res.redirect(redirectUrl);
  } catch (err) {
    res.render("notfound");
  }
};
