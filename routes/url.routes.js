const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const urlController = require("../controllers/url.controller");
const authMiddleWare = require("../middleware/auth.middleware");

router.post(
  "/shorten",
  authMiddleWare,
  body("longUrl").isURL().withMessage("Please provide a Valid URL"),
  urlController.shorten
);

router.get(
  "/stats",
  authMiddleWare,
  query("shortCode")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid Short URL"),
  urlController.getStats
);

router.delete(
  "/delete",
  authMiddleWare,
  query("shortCode")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid Short URL"),
  urlController.deleteUrl
);

module.exports = router;
