const { validationResult } = require("express-validator");
const urlService = require("../services/url.service");
const urlModel = require("../models/url.model");
const userModel = require("../models/user.model");
const { sendSuccess, sendError } = require("../utils/response.util");

module.exports.shorten = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { longUrl } = req.body;
  const id = req.user._id;

  try {
    const shortUrl = await urlService.shorten({ id, longUrl });
    return sendSuccess(
      res,
      "URL Shortened Successfully",
      { shortUrl: shortUrl },
      201
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.getStats = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { shortCode } = req.query;
  if (!shortCode) {
    return sendError(
      res,
      "ShortURL code is required",
      "shortCode not provided in params",
      400
    );
  }

  const id = req.user._id;

  try {
    const url = await urlModel.findOne({ shortCode });
    if (!url) {
      return sendError(
        res,
        "URL Not Found",
        "No URL is linked to the provided ShortCode",
        404
      );
    }
    if (String(url.user) != String(id)) {
      return sendError(
        res,
        "Unauthorized",
        "UserId of the user who created the URL does not match with the UserId of the request",
        401
      );
    }
    return sendSuccess(
      res,
      "URL Stats sent Successfully",
      { shortUrl: url },
      200
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.createCustomUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { existingCode, customCode } = req.body;
  const id = req.user._id;

  try {
    const url = await urlModel.findOne({ shortCode: existingCode });
    if (!url) {
      return sendError(
        res,
        "Invalid Existing Short Code",
        "No URL exists with given original short code",
        404
      );
    }

    if (String(url.user) !== String(id)) {
      return sendError(
        res,
        "Unauthorized",
        "The UserId connected with the URL does not match the requester's UserId",
        401
      );
    }

    const exists = await urlModel.findOne({ shortCode: customCode });
    if (exists) {
      return sendError(
        res,
        "This Custom URL is already taken",
        "The provided Custom Code is already linked to another link",
        409
      );
    }

    const updatedUrl = await urlService.createCustomUrl({
      existingCode,
      customCode,
      id,
    });

    return sendSuccess(
      res,
      "Custom Code attached successfully",
      { url: updatedUrl },
      200
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};

module.exports.deleteUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation Error", errors.array(), 400);
  }

  const { shortCode } = req.query;
  if (!shortCode) {
    return sendError(
      res,
      "ShortURL code is required",
      "shortCode not provided in params",
      400
    );
  }
  const id = req.user._id;

  try {
    const url = await urlModel.findOne({ shortCode });
    if (!url) {
      return sendError(
        res,
        "URL Not Found",
        "No URL is linked to the provided ShortCode",
        404
      );
    }
    if (String(url.user) !== String(id)) {
      return sendError(
        res,
        "Unauthorized",
        "UserId of the user who created the URL does not match with the UserId of the request",
        401
      );
    }

    const deletedUrl = await urlModel.findOneAndDelete({ shortCode });
    const user = await userModel.findById(deletedUrl.user);
    user.links.pull(deletedUrl._id);
    await user.save();

    return sendSuccess(
      res,
      "URL Deleted Successfully",
      { deletedUrl: deletedUrl },
      200
    );
  } catch (error) {
    return sendError(res, "Something Went Wrong", error.message, 500);
  }
};
