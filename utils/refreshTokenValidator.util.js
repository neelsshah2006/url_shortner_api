const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { UnauthorizedError } = require("./appError.util");

const validateRefreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await userModel.findById(decoded._id);

  if (!user) throw new UnauthorizedError("User not found");

  await user.cleanupExpiredTokens(true);
  if (user.refreshToken.length === 0) {
    throw new UnauthorizedError("Invalid refresh token");
  }
  const tokenExists = user.refreshToken.some((tokenObj) => {
    const tokenString =
      typeof tokenObj === "string" ? tokenObj : tokenObj.token;
    return tokenString === refreshToken;
  });

  if (!tokenExists) {
    throw new UnauthorizedError("Invalid refresh token");
  }
  return user;
};

module.exports = validateRefreshToken;
