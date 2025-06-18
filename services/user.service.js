const userModel = require("../models/user.model");
const {
  BadRequestError,
  ConflictError,
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

const updateProfile = async ({ firstName, lastName, username, id }) => {
  if (!firstName || !lastName) {
    throw new BadRequestError("First and last name are required");
  }

  if (!username) {
    throw new BadRequestError("Username is required");
  }

  const isUser = await userModel.findById(id);
  if (!isUser) throw new NotFoundError("User not found");

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { fullName: { firstName, lastName }, username },
    { new: true }
  );

  return user;
};

const changePassword = async ({ oldPassword, newPassword, id }) => {
  if (!id || !newPassword || !oldPassword) {
    throw new BadRequestError("All fields are required");
  }

  const user = await userModel.findById(id).select("+password");
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new UnauthorizedError("Incorrect old password");

  if (oldPassword === newPassword) {
    throw new ConflictError("Old and new passwords must be different");
  }

  user.password = await userModel.hashPassword(newPassword);
  await user.save();

  return await userModel.findById(id).select("-password");
};

module.exports = {
  register,
  updateProfile,
  changePassword,
};
