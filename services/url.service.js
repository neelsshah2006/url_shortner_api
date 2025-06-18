const crypto = require("crypto");
const urlModel = require("../models/url.model");
const userModel = require("../models/user.model");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/appError.util");

const SHORTCODE_LENGTH = 6;
const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CHARSET_LEN = CHARSET.length;

function generateRandomString(length) {
  let result = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i] % CHARSET_LEN];
  }
  return result;
}

async function generateUniqueShortCode(length = SHORTCODE_LENGTH) {
  let shortCode;
  let exists;

  do {
    shortCode = generateRandomString(length);
    exists = await urlModel.exists({ shortCode });
  } while (exists);

  return shortCode;
}

const shorten = async ({ longUrl, id }) => {
  if (!id || !longUrl) {
    throw new BadRequestError("User ID and long URL are required.");
  }

  const shortCode = await generateUniqueShortCode();

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

  const exists = await urlModel.findOne({ shortCode: customCode });
  if (exists) throw new ConflictError("Custom code is already in use.");

  const url = await urlModel.findOne({ shortCode: existingCode });
  if (!url) throw new NotFoundError("Original short code does not exist.");
  if (String(url.user) !== String(id)) {
    throw new UnauthorizedError(
      "You do not have permission to modify this URL."
    );
  }

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
