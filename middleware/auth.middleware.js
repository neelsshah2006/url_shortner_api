const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/appError.util");
const setCookie = require("../utils/setCookie.util");
const validateRefreshToken = require("../utils/refreshTokenValidator.util");

module.exports = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    throw new UnauthorizedError("Access token not found");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const tokenExists = user.refreshToken.some((tokenObj) => {
      const tokenString =
        typeof tokenObj === "string" ? tokenObj : tokenObj.token;
      return tokenString === refreshToken;
    });

    if (!tokenExists) {
      throw new UnauthorizedError("Invalid refresh token - Please login again");
    }

    const userObj = await user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    req.user = userObj;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        if (!refreshToken) {
          throw new UnauthorizedError(
            "Access token expired and no refresh token provided"
          );
        }

        const user = await validateRefreshToken(refreshToken);
        const newAccessToken = user.generateAccessToken();
        setCookie(res, "accessToken", newAccessToken);

        const userObj = await user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        req.user = userObj;
        next();
      } catch (refreshError) {
        if (refreshError.name === "TokenExpiredError") {
          throw new UnauthorizedError(
            "Refresh token expired - Please login again"
          );
        } else if (refreshError.name === "JsonWebTokenError") {
          throw new UnauthorizedError(
            "Invalid refresh token - Please login again"
          );
        }
        throw refreshError;
      }
    } else if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Invalid access token");
    } else {
      throw error;
    }
  }
};
