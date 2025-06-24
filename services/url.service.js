const urlModel = require("../models/url.model");
const crypto6 = require("../utils/crypto.util");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/appError.util");
const clickModel = require("../models/click.model");

const shorten = async ({ longUrl, id }) => {
  if (!id || !longUrl) {
    throw new BadRequestError("User ID and long URL are required.");
  }

  const shortCode = crypto6();

  const url = await urlModel.create({
    user: id,
    longUrl,
    shortCode,
  });

  return url;
};

const getStats = async ({ shortCode, id }) => {
  const url = await urlModel.findOne({ shortCode });
  if (!url)
    throw new NotFoundError("No URL is linked to the provided ShortCode");

  if (String(url.user) !== String(id)) {
    throw new UnauthorizedError(
      "User does not have permission to access this URL"
    );
  }

  const clicks = await clickModel.find({ url: url._id });

  return { shortUrl: url, clicks };
};

const createCustomUrl = async ({ existingCode, customCode, id }) => {
  if (!existingCode || !customCode || !id) {
    throw new BadRequestError(
      "All fields (existingCode, customCode, id) are required."
    );
  }

  const url = await urlModel.findOne({ shortCode: existingCode });
  if (!url) throw new NotFoundError("Original short code does not exist.");
  if (String(url.user) !== String(id)) {
    throw new UnauthorizedError(
      "You do not have permission to modify this URL."
    );
  }

  if (existingCode === customCode) {
    throw new BadRequestError(
      "Existing code is same as the required custom code"
    );
  }

  const exists = await urlModel.findOne({ shortCode: customCode });
  if (exists) throw new ConflictError("Custom code is already in use.");

  const updatedUrl = await urlModel.findOneAndUpdate(
    { shortCode: existingCode },
    { shortCode: customCode },
    { new: true }
  );

  return updatedUrl;
};

const deleteUrl = async ({ shortCode, id }) => {
  const url = await urlModel.findOne({ shortCode });
  if (!url) throw new NotFoundError("No URL found for this ShortCode");

  if (String(url.user) !== String(id)) {
    throw new UnauthorizedError("You can only delete URLs you created");
  }

  const deletedUrl = await urlModel.findOneAndDelete({ shortCode });
  await clickModel.deleteMany({ url: deletedUrl._id });
  return deletedUrl;
};

module.exports = {
  shorten,
  getStats,
  createCustomUrl,
  deleteUrl,
};
