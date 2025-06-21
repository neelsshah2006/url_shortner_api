const express = require("express");
const path = require("path");
const redirectController = require("../controllers/redirect.controller");
const { ua } = require("../utils/UAParser.util");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/not-found", (req, res) => {
  return res.render("notfound");
});

router.get("/favicon.ico", (req, res) => {
  return res.sendFile(path.join(__dirname, "../public/images/favicon.png"));
});

router.use(ua);

router.get("/:shortCode", redirectController.redirection);

module.exports = router;
