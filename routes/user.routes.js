const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/register",
  body("firstName")
    .exists()
    .isLength({ min: 3 })
    .withMessage("First Name must be atleast 3 characters long"),
  body("lastName")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Last Name must be atleast 3 characters long"),
  body("email").isEmail().withMessage("Invalid Email"),
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password")
    .exists()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .withMessage(
      "Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character"
    ),
  userController.register
);

router.post(
  "/login",
  body("password")
    .exists()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .withMessage("Invalid Email/Username or Password"),
  body("email")
    .if(body("username").not().exists())
    .notEmpty()
    .withMessage("Email is required when username is not provided")
    .bail()
    .isEmail()
    .withMessage("Invalid Email or Password"),
  body("username")
    .if(body("email").not().exists())
    .notEmpty()
    .withMessage("Username is required when email is not provided"),
  userController.login
);

router.get("/profile", authMiddleware, userController.getProfile);

router.get("/get-links", authMiddleware, userController.getLinks);

router.patch(
  "/update-profile",
  authMiddleware,
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
  authMiddleware,
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

router.get("/logout", authMiddleware, userController.logout);

module.exports = router;
