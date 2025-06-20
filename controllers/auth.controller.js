const { validationResult } = require("express-validator");
const catchAsync = require("../utils/catchAsync.util");
const userModel = require("../models/user.model");
const authService = require("../services/auth.service");
const setCookie = require("../utils/setCookie.util");
const { sendSuccess } = require("../utils/response.util");
const { BadRequestError, ConflictError } = require("../utils/appError.util");

// Register
module.exports.register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation failed");

  const { firstName, lastName, username, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const emailExists = await userModel.findOne({ email: normalizedEmail });
  if (emailExists) throw new ConflictError("Email already exists");

  const usernameExists = await userModel.findOne({ username });
  if (usernameExists) throw new ConflictError("Username not available");

  const {
    token: { accessToken, refreshToken },
    user,
  } = await authService.register({
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
  if (!errors.isEmpty()) throw new BadRequestError("Validation failed");

  const { email, username, password } = req.body;
  if (!email && !username)
    throw new BadRequestError("Email or Username is required");

  const {
    token: { accessToken, refreshToken },
    user,
  } = await authService.login({ email, username, password });
  setCookie(res, "accessToken", accessToken);
  setCookie(res, "refreshToken", refreshToken);
  sendSuccess(res, "User Login Successful", user, 200);
});

// Logout
module.exports.logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new BadRequestError("RefreshToken is required");

  const {message} = await authService.logout({ refreshToken });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendSuccess(res, message, "Logged Out", 200);
});
