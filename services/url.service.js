const urlModel = require("../models/url.model");
const nanoid6 = require("../utils/nanoid6.util");
const userModel = require("../models/user.model");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/appError.util");

const shorten = async ({ longUrl, id }) => {
  if (!id || !longUrl) {
    throw new BadRequestError("User ID and long URL are required.");
  }

  const shortCode = nanoid6();

  const url = await urlModel.create({
    user: id,
    longUrl,
    shortCode,
  });

  const user = await userModel.findById(id);
  if (!user) throw new NotFoundError("User not found");

  user.links.push(url._id);
  await user.save();

  return url;
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

module.exports = {
  shorten,
  createCustomUrl,
};
