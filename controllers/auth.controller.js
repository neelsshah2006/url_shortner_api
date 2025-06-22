const { BadRequestError } = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");
const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/response.util");

// Logout
module.exports.logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new BadRequestError("RefreshToken is required");

  const { message } = await authService.logout({ refreshToken });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendSuccess(res, message, "Logged Out", 200);
});

// Check Authentication
module.exports.checkAuth = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new BadRequestError("User not authenticated");

  sendSuccess(res, "User is authenticated", user, 200);
});
