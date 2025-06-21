const { validationResult } = require("express-validator");
const urlService = require("../services/url.service");
const { BadRequestError } = require("../utils/appError.util");
const { sendSuccess } = require("../utils/response.util");
const catchAsync = require("../utils/catchAsync.util");
const { checkUrlSafety } = require("../utils/checkUrlSafety.util");

// SHORTEN
module.exports.shorten = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new BadRequestError("Validation Error");

  const { longUrl } = req.body;
  if (process.env.GOOGLE_SAFE_BROWSING_API_KEY) {
    const isSafe = checkUrlSafety(longUrl);
    if (!isSafe) {
      throw new BadRequestError("URL flagged as Unsafe");
    }
  }
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
  const data = await urlService.getStats({ shortCode, id });
  return sendSuccess(res, "URL Stats sent Successfully", data, 200);
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
    { shortUrl: updatedUrl },
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
  const deletedUrl = await urlService.deleteUrl({ shortCode, id });
  return sendSuccess(res, "URL Deleted Successfully", { deletedUrl }, 200);
});
