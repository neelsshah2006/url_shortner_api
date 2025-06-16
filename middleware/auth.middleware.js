const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response.util");

module.exports = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return sendError(res, "Unauthorized", "Token Not Found", 401);
  }

  const isBlacklisted = await blacklistModel.findOne({ token: token });
  if (isBlacklisted) {
    return sendError(
      res,
      "Unauthorized",
      "Token already Logged Out -- Token Blacklisted",
      401
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    return next();
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};
