const { validationResult } = require("express-validator");
const catchAsync = require("../utils/catchAsync.util");
const userModel = require("../models/user.model");
const authService = require("../services/auth.service");
const setCookie = require("../utils/setCookie.util");
const { sendSuccess } = require("../utils/response.util");
const blacklistModel = require("../models/blacklist.model");
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
  if (usernameExists) throw new ConflictError("Username already taken");

  const registerData = await authService.register({
    firstName,
    lastName,
    username,
    email: normalizedEmail,
    password,
  });

  setCookie(res, registerData.token);
  sendSuccess(res, "User Registered Successfully", registerData, 201);
});

// Login
module.exports.login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation failed");

  const { email, username, password } = req.body;
  if (!email && !username)
    throw new BadRequestError("Email or Username is required");

  const loginData = await authService.login({ email, username, password });
  setCookie(res, loginData.token);
  sendSuccess(res, "User Login Successful", loginData, 200);
});

// Logout
module.exports.logout = catchAsync(async (req, res) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) throw new BadRequestError("Token is required");

  await blacklistModel.create({ token });
  res.clearCookie("token");
  sendSuccess(res, "Logged Out Successfully", "Logged Out", 200);
});
