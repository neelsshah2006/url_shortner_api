const { validationResult } = require("express-validator");
const urlService = require("../services/url.service");
const urlModel = require("../models/url.model");
const userModel = require("../models/user.model");

const {
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/appError.util");

const { sendSuccess } = require("../utils/response.util");
const catchAsync = require("../utils/catchAsync.util");

// SHORTEN
module.exports.shorten = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation Error");

  const { longUrl } = req.body;
  const id = req.user._id;

  const shortUrl = await urlService.shorten({ longUrl, id });

  return sendSuccess(res, "URL Shortened Successfully", { shortUrl }, 201);
});

// GET STATS
module.exports.getStats = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation Error");

  const { shortCode } = req.query;
  if (!shortCode)
    throw new BadRequestError("shortCode query param is required");

  const id = req.user._id;

  const url = await urlModel.findOne({ shortCode });
  if (!url)
    throw new NotFoundError("No URL is linked to the provided ShortCode");

  if (String(url.user) !== String(id)) {
    throw new UnauthorizedError(
      "User does not have permission to access this URL"
    );
  }

  return sendSuccess(
    res,
    "URL Stats sent Successfully",
    { shortUrl: url },
    200
  );
});

// CREATE CUSTOM URL
module.exports.createCustomUrl = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation Error");

  const { existingCode, customCode } = req.body;
  const id = req.user._id;

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
});

// DELETE URL
module.exports.deleteUrl = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation Error");

  const { shortCode } = req.query;
  if (!shortCode)
    throw new BadRequestError("shortCode query param is required");

  const id = req.user._id;

  const url = await urlModel.findOne({ shortCode });
  if (!url) throw new NotFoundError("No URL found for this ShortCode");

  if (String(url.user) !== String(id)) {
    throw new UnauthorizedError("You can only delete URLs you created");
  }

  const deletedUrl = await urlModel.findOneAndDelete({ shortCode });
  const user = await userModel.findById(deletedUrl.user);
  user.links.pull(deletedUrl._id);
  await user.save();

  return sendSuccess(res, "URL Deleted Successfully", { deletedUrl }, 200);
});
