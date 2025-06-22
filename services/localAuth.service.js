const userModel = require("../models/user.model");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../utils/appError.util");

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

const registerOAuthConflictResolver = async ({
  id,
  password,
  username,
  firstName,
  lastName,
}) => {
  const hashedPassword = await userModel.hashPassword(password);
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      authProvider: "local",
      password: hashedPassword,
      username: username,
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
    },
    { new: true }
  );
  const token = user.generateAuthToken();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { token, user: userObj };
};

const login = async ({ email, username, password }) => {
  const query = email ? { email: email.trim().toLowerCase() } : { username };
  const user = await userModel.findOne(query).select("+password");
  if (!user) throw new UnauthorizedError("Invalid Credentials");
  if (user.authProvider === "google")
    throw new BadRequestError(
      "This account uses Google OAuth. Please log in with Google."
    );

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthorizedError("Invalid Credentials");

  await user.cleanupExpiredTokens(true);

  const token = await user.generateAuthToken();
  const userObj = await user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { token, user: userObj };
};

module.exports = {
  register,
  registerOAuthConflictResolver,
  login,
};
