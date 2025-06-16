const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const { sendSuccess, sendError } = require("../utils/response.util");
const setCookie = require("../utils/setCookie.util");

module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { firstName, lastName, username, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const emailExists = await userModel.findOne({ email: normalizedEmail });
    if (emailExists) {
      return sendError(
        res,
        "User with this Email already exists",
        "Email already exists",
        409
      );
    }

    const usernameExists = await userModel.findOne({ username: username });
    if (usernameExists) {
      return sendError(
        res,
        "Username not available",
        "Username already Taken",
        409
      );
    }

    const { token, user } = await userService.register({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: normalizedEmail,
      password: password,
    });

    setCookie(res, token);

    return sendSuccess(
      res,
      "User Registered Successfully",
      { token: token, user: user },
      201
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  if (req.body.email) {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const user = await userModel
        .findOne({ email: normalizedEmail })
        .select("+password");
      if (!user) {
        return sendError(
          res,
          "Invalid Email or Password",
          "No User found With given Email",
          404
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return sendError(
          res,
          "Invalid Email or Password",
          "Given Password is Incorrect",
          401
        );
      }

      const token = user.generateAuthToken();
      setCookie(res, token);

      const userWithoutPassword = await userModel
        .findOne({
          email: user.email,
        })
        .select("-password");

      return sendSuccess(
        res,
        "User Login Successful",
        { token: token, user: userWithoutPassword },
        200
      );
    } catch (error) {
      return sendError(res, "Something Went Wrong", error.message, 500);
    }
  } else if (req.body.username) {
    const { username, password } = req.body;
    try {
      const user = await userModel
        .findOne({ username: username })
        .select("+password");

      if (!user) {
        return sendError(
          res,
          "Invalid Username or Password",
          "No User found With given Username",
          404
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return sendError(
          res,
          "Invalid Email or Password",
          "Given Password is Incorrect",
          401
        );
      }

      const token = user.generateAuthToken();
      setCookie(res, token);

      const userWithoutPassword = await userModel
        .findOne({
          email: user.email,
        })
        .select("-password");

      return sendSuccess(
        res,
        "User Login Successful",
        { token: token, user: userWithoutPassword },
        200
      );
    } catch (err) {
      return sendError(res, "Something Went Wrong", error.message, 500);
    }
  } else {
    return sendError(
      res,
      "Email or Username is required",
      "Both Email and Username are not provided",
      400
    );
  }
};

module.exports.getProfile = async (req, res) => {
  return sendSuccess(res, "Profile Sent Successfully", { user: req.user }, 200);
};

module.exports.getLinks = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await userModel.findById(id).populate({
      path: "links",
      select: "shortCode longUrl visitCount createdAt",
    });
    return sendSuccess(
      res,
      "Links Sent Successfully",
      { links: user.links },
      200
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { firstName, lastName, username } = req.body;
  const id = req.user._id;

  try {
    const user = await userService.updateProfile({
      firstName,
      lastName,
      username,
      id,
    });

    return sendSuccess(
      res,
      "Profile Updated Successfully",
      { user: user },
      200
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { oldPassword, newPassword } = req.body;
  if (!newPassword || !oldPassword) {
    return sendError(
      res,
      "Both old and new passwords are required to update password",
      "Old and New Passwords are Same",
      400
    );
  }

  const id = req.user._id;

  try {
    const user = await userService.changePassword({
      oldPassword,
      newPassword,
      id,
    });

    return sendSuccess(
      res,
      "Password Changed Successfully",
      { user: user },
      200
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.logout = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      await blacklistModel.create({ token });
      res.clearCookie("token");
    } catch (error) {
      return sendError(res, "Something Went Wrong", error.message, 500);
    }
  } else {
    return sendError(res, "Token Not Found", "Token is required", 400);
  }
  return sendSuccess(res, "Logged Out Successfully", "Logged Out", 200);
};
