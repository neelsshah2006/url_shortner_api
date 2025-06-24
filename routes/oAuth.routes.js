const express = require("express");
const router = express.Router();
const passport = require("passport");
const oAuthController = require("../controllers/oAuth.controller");
const { UnauthorizedError } = require("../utils/appError.util");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/oauth/failure",
  }),
  oAuthController.callback
);

router.get("/failure", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth?error=Google_Auth_failed`);
});

module.exports = router;
