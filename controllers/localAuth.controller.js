const { validationResult } = require("express-validator");
const catchAsync = require("../utils/catchAsync.util");
const userModel = require("../models/user.model");
const localAuthService = require("../services/localAuth.service");
const setCookie = require("../utils/setCookie.util");
const { sendSuccess } = require("../utils/response.util");
const { BadRequestError, ConflictError } = require("../utils/appError.util");

// Register
module.exports.register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new BadRequestError({
      message: "Validation Error",
      errors: errors.array(),
    });

  const { firstName, lastName, username, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = await userModel.findOne({ email: normalizedEmail });
  if (emailExists) {
    const authType = emailExists.authProvider;
    if (authType === "google") {
      const usernameExists = await userModel.findOne({ username });
      if (usernameExists) throw new ConflictError("Username not available");
      const {
        token: { accessToken, refreshToken },
        user,
      } = await localAuthService.registerOAuthConflictResolver({
        id: emailExists._id,
        password,
        firstName,
        lastName,
        username,
      });
      setCookie(res, "accessToken", accessToken);
      setCookie(res, "refreshToken", refreshToken);
      return sendSuccess(
        res,
        "User Registered Successfully",
        { user: user },
        201
      );
    } else {
      throw new ConflictError("Email Already Exists");
    }
  }

  const usernameExists = await userModel.findOne({ username });
  if (usernameExists) throw new ConflictError("Username not available");

  const {
    token: { accessToken, refreshToken },
    user,
  } = await localAuthService.register({
    firstName,
    lastName,
    username,
    email: normalizedEmail,
    password,
  });

  setCookie(res, "accessToken", accessToken);
  setCookie(res, "refreshToken", refreshToken);
  sendSuccess(res, "User Registered Successfully", user, 201);
});

// Login
module.exports.login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new BadRequestError({
      message: "Validation Error",
      errors: errors.array(),
    });

  const { email, username, password } = req.body;
  if (!email && !username)
    throw new BadRequestError("Email or Username is required");

  const {
    token: { accessToken, refreshToken },
    user,
  } = await localAuthService.login({ email, username, password });
  setCookie(res, "accessToken", accessToken);
  setCookie(res, "refreshToken", refreshToken);
  sendSuccess(res, "User Login Successful", user, 200);
});

// Logout
module.exports.logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new BadRequestError("RefreshToken is required");

  const { message } = await localAuthService.logout({ refreshToken });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendSuccess(res, message, "Logged Out", 200);
});
