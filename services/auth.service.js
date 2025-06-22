const {
  BadRequestError,
  UnauthorizedError,
} = require("../utils/appError.util");
const validateRefreshToken = require("../utils/refreshTokenValidator.util");

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
  logout,
};
