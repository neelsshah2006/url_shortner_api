const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const urlController = require("../controllers/url.controller");

router.post(
  "/shorten",
  body("longUrl").exists().isURL().withMessage("Please provide a Valid URL"),
  urlController.shorten
);

router.patch(
  "/custom-url",
  body("existingCode")
    .isString()
    .exists()
    .isLength({ min: 6 })
    .withMessage("Existing Short Code is required"),
  body("customCode")
    .isString()
    .exists()
    .isLength({ min: 6 })
    .withMessage(
      "Custom Code is required and must be atleast 6 characters long"
    ),
  urlController.createCustomUrl
);

router.get(
  "/stats",
  query("shortCode")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Invalid Short URL"),
  urlController.getStats
);

router.delete(
  "/delete",
  query("shortCode")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Invalid Short URL"),
  urlController.deleteUrl
);

module.exports = router;
