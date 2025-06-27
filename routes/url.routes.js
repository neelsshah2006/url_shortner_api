const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const urlController = require("../controllers/url.controller");

router.post(
  "/shorten",
  body("longUrl")
    .exists()
    .withMessage("Long URL is required")
    .bail()
    .isURL()
    .withMessage("Please provide a Valid URL"),
  urlController.shorten
);

router.patch(
  "/custom-url",
  body("existingCode")
    .exists()
    .withMessage("Existing Short Code is required")
    .bail()
    .isString()
    .withMessage("Existing Short Code must be a string")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Existing Short Code must be at least 6 characters long"),
  body("customCode")
    .exists()
    .withMessage("Custom Code is required")
    .bail()
    .isString()
    .withMessage("Custom Code must be a string")
    .bail()
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
    .withMessage("Short Code is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Invalid Short URL"),
  urlController.getStats
);

router.delete(
  "/delete",
  query("shortCode")
    .exists()
    .withMessage("Short Code is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Invalid Short URL"),
  urlController.deleteUrl
);

module.exports = router;
