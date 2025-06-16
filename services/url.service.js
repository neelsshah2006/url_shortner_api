const crypto = require("crypto");
const urlModel = require("../models/url.model");
const userModel = require("../models/user.model");

async function generateUniqueShortCode() {
  let shortCode;
  let exists = true;
  while (exists) {
    shortCode = crypto.randomBytes(8).toString("hex").slice(0, 6);
    exists = await urlModel.findOne({ shortCode });
  }
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
