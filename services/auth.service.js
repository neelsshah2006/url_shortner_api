const userModel = require("../models/user.model");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
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

  return { token, user: userObj };
};

const login = async ({ email, username, password }) => {
  const query = email ? { email: email.trim().toLowerCase() } : { username };
  const user = await userModel.findOne(query).select("+password");
  if (!user) throw new UnauthorizedError("Invalid Credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthorizedError("Invalid Credentials");

  const token = user.generateAuthToken();
  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};

module.exports = {
  register,
  login,
};
