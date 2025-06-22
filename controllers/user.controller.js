const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const urlModel = require("../models/url.model");
const { BadRequestError } = require("../utils/appError.util");
const { sendSuccess } = require("../utils/response.util");
const catchAsync = require("../utils/catchAsync.util");

// Profile
module.exports.getProfile = catchAsync(async (req, res) => {
  sendSuccess(res, "Profile Sent Successfully", { user: req.user }, 200);
});

// Get links
module.exports.getLinks = catchAsync(async (req, res) => {
  const links = await urlModel
    .find({ user: req.user._id })
    .select("shortCode longUrl visitCount createdAt")
    .sort({ createdAt: -1 });

  sendSuccess(res, "Links Sent Successfully", { links }, 200);
});

// Update Profile
module.exports.updateProfile = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new BadRequestError({
      message: "Validation Error",
      errors: errors.array(),
    });

  const { firstName, lastName, username } = req.body;
  const id = req.user._id;

  const user = await userService.updateProfile({
    firstName,
    lastName,
    username,
    id,
  });

  const userObj = await user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  sendSuccess(res, "Profile Updated Successfully", { user: userObj }, 200);
});

// Change Password
module.exports.changePassword = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new BadRequestError({
      message: "Validation Error",
      errors: errors.array(),
    });

  const { oldPassword, newPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw new BadRequestError("Both old and new passwords are required");
  }

  const user = await userService.changePassword({
    oldPassword,
    newPassword,
    id: req.user._id,
  });

  const userObj = await user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  sendSuccess(res, "Password Changed Successfully", { user: userObj }, 200);
});
