const { customAlphabet } = require("nanoid");

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid6 = customAlphabet(alphabet, 6);

module.exports = nanoid6;
