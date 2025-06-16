const express = require("express");
const urlModel = require("../models/url.model");
const { sendError } = require("../utils/response.util");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/not-found", (req, res) => {
  return res.render("notfound");
});

router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await urlModel.findOne({ shortCode });
    if (!url) {
      return res.redirect("/not-found");
    }

    await url.incrementVisitCount();

    let redirectUrl = url.longUrl;
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = "http://" + redirectUrl;
    }
    return res.redirect(redirectUrl);
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
});

module.exports = router;
