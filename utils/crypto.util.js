const crypto = require("crypto");

const crypto6 = () => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.randomBytes(6);
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }

  return result;
};

module.exports = crypto6;
