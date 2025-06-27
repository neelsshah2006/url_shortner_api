const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const localAuthController = require("../controllers/localAuth.controller");

router.post(
  "/register",
  body("firstName")
    .exists()
    .withMessage("First Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("First Name must be atleast 3 characters long"),
  body("lastName")
    .exists()
    .withMessage("Last Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Last Name must be atleast 3 characters long"),
  body("email").isEmail().withMessage("Invalid Email"),
  body("username")
    .exists()
    .withMessage("Username is required")
    .bail()
    .isString()
    .withMessage("Username must be a string"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character"
    )
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .withMessage(
      "Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character"
    ),
  localAuthController.register
);

router.post(
  "/login",
  body("password")
    .exists()
    .withMessage("Email/Username and Password are required")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Invalid Email/Username or Password")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .withMessage("Invalid Email/Username or Password"),
  body("email")
    .if(body("username").not().exists())
    .notEmpty()
    .withMessage("Email/Username is required")
    .bail()
    .isEmail()
    .withMessage("Invalid Email or Password"),
  body("username")
    .if(body("email").not().exists())
    .notEmpty()
    .withMessage("Email/Username is required"),
  localAuthController.login
);

module.exports = router;
