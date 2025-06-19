const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

router.get("/profile", userController.getProfile);

router.get("/get-links", userController.getLinks);

router.patch(
  "/update-profile",
  body("firstName")
    .exists()
    .isLength({ min: 3 })
    .withMessage("First Name must be atleast 3 characters long"),
  body("lastName")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Last Name must be atleast 3 characters long"),
  body("username")
    .exists()
    .isString()
    .notEmpty()
    .withMessage("Username is required"),
  userController.updateProfile
);

router.patch(
  "/change-password",
  body("oldPassword")
    .exists()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .withMessage("Incorrect Old Password"),
  body("newPassword")
    .exists()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .withMessage(
      "New Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character"
    ),
  userController.changePassword
);

module.exports = router;
