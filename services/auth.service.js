const userModel = require("../models/user.model");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../utils/appError.util");
const validateRefreshToken = require("../utils/refreshTokenValidator.util");

const register = async ({ firstName, lastName, username, email, password }) => {
  if (!firstName || !lastName || !username || !email || !password) {
    throw new BadRequestError("All fields are required");
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    fullName: { firstName, lastName },
    username,
    email,
    password: hashedPassword,
  });

  const token = await user.generateAuthToken();
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { token, user: userObj };
};

const login = async ({ email, username, password }) => {
  const query = email ? { email: email.trim().toLowerCase() } : { username };
  const user = await userModel.findOne(query).select("+password");
  if (!user) throw new UnauthorizedError("Invalid Credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthorizedError("Invalid Credentials");

  await user.cleanupExpiredTokens(true);

  const token = await user.generateAuthToken();
  const userObj = await user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { token, user: userObj };
};

const logout = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const user = await validateRefreshToken(refreshToken);
    await user.removeRefreshToken(refreshToken);
    return { message: "Logged out successfully" };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Refresh token expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Invalid refresh token");
    }
    throw error;
  }
};

module.exports = {
  register,
  login,
  logout,
};
