const crypto = require("crypto");
const urlModel = require("../models/url.model");
const userModel = require("../models/user.model");

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

module.exports.shorten = async ({ longUrl, id }) => {
  if (!id || !longUrl) {
    throw new Error("All fields are Required");
  }

  const shortCode = await generateUniqueShortCode();

  const url = await urlModel.create({
    user: id,
    longUrl: longUrl,
    shortCode: shortCode,
  });

  const user = await userModel.findById(id);
  if (!user) throw new Error("User not found");
  user.links.push(url._id);
  await user.save();

  return url;
};

module.exports.createCustomUrl = async ({ existingCode, customCode, id }) => {
  if (!existingCode || !customCode || !id) {
    throw new Error("All Fields Are Required");
  }

  const newUrl = await urlModel.findOneAndUpdate(
    { shortCode: existingCode },
    { shortCode: customCode },
    { new: true }
  );

  return newUrl;
};
