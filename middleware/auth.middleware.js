const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/appError.util");

module.exports = async (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Token Not Found");
  }

  const isBlacklisted = await blacklistModel.findOne({ token: token });
  if (isBlacklisted) {
    throw new UnauthorizedError(
      "Token already Logged Out -- Token Blacklisted"
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new UnauthorizedError("Invalid or expired token");
    }
    throw error;
  }
};
