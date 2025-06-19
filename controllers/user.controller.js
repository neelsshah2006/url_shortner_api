const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const { BadRequestError } = require("../utils/appError.util");
const { sendSuccess } = require("../utils/response.util");
const catchAsync = require("../utils/catchAsync.util");

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
