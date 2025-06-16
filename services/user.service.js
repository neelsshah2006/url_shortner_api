const userModel = require("../models/user.model");

module.exports.register = async ({
  firstName,
  lastName,
  username,
  email,
  password,
}) => {
  if (!firstName || !lastName || !username || !email || !password) {
    throw new Error("All fields are Required");
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    username,
    email,
    password: hashedPassword,
  });

  const token = await user.generateAuthToken();
  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};

module.exports.updateProfile = async ({
  firstName,
  lastName,
  username,
  id,
}) => {
  if (!firstName || !lastName) {
    throw new Error("First and last name are required");
  }

  if (!username) {
    throw new Error("Username is required");
  }

  const isUser = await userModel.findById(id);
  if (!isUser) {
    throw new Error("This User does not exist");
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { fullName: { firstName, lastName }, username },
    { new: true }
  );

  return user;
};

module.exports.changePassword = async ({ oldPassword, newPassword, id }) => {
  if (!id || !newPassword || !oldPassword) {
    throw new Error("All fields are required");
  }

  const user = await userModel.findById(id).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new Error("Incorrect Password");
  }

  if (oldPassword === newPassword) {
    throw new Error("Old and New Password Cannot be Same");
  }

  user.password = await userModel.hashPassword(newPassword);
  await user.save();

  const userWithoutPassword = await userModel.findById(id);
  return userWithoutPassword;
};
