const express = require("express");
const localAuthRoutes = require("./localAuth.routes");
const oAuthRoutes = require("./oAuth.routes");
const authMiddleware = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.use("/local", localAuthRoutes);

router.use("/oauth", oAuthRoutes);

router.get("/logout", authMiddleware, authController.logout);

module.exports = router;
