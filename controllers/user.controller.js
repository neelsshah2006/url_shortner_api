const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/appError.util");
const { sendSuccess } = require("../utils/response.util");
const setCookie = require("../utils/setCookie.util");
const catchAsync = require("../utils/catchAsync.util");

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

  const { token, user } = await userService.register({
    firstName,
    lastName,
    username,
    email: normalizedEmail,
    password,
  });

  setCookie(res, token);
  sendSuccess(res, "User Registered Successfully", { token, user }, 201);
});

// Login
module.exports.login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation failed");

  const { email, username, password } = req.body;
  if (!email && !username)
    throw new BadRequestError("Email or Username is required");

  const query = email ? { email: email.trim().toLowerCase() } : { username };
  const user = await userModel.findOne(query).select("+password");
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthorizedError("Incorrect password");

  const token = user.generateAuthToken();
  setCookie(res, token);

  const userWithoutPassword = await userModel
    .findById(user._id)
    .select("-password");
  sendSuccess(
    res,
    "User Login Successful",
    { token, user: userWithoutPassword },
    200
  );
});

// Profile
module.exports.getProfile = catchAsync(async (req, res) => {
  sendSuccess(res, "Profile Sent Successfully", { user: req.user }, 200);
});

// Get links
module.exports.getLinks = catchAsync(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate({
    path: "links",
    select: "shortCode longUrl visitCount createdAt",
  });

  sendSuccess(res, "Links Sent Successfully", { links: user.links }, 200);
});

// Update Profile
module.exports.updateProfile = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation failed");

  const { firstName, lastName, username } = req.body;
  const id = req.user._id;

  const user = await userService.updateProfile({
    firstName,
    lastName,
    username,
    id,
  });

  sendSuccess(res, "Profile Updated Successfully", { user }, 200);
});

// Change Password
module.exports.changePassword = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation failed");

  const { oldPassword, newPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw new BadRequestError("Both old and new passwords are required");
  }

  const user = await userService.changePassword({
    oldPassword,
    newPassword,
    id: req.user._id,
  });

  sendSuccess(res, "Password Changed Successfully", { user }, 200);
});

// Logout
module.exports.logout = catchAsync(async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) throw new BadRequestError("Token is required");

  await blacklistModel.create({ token });
  res.clearCookie("token");
  sendSuccess(res, "Logged Out Successfully", "Logged Out", 200);
});
