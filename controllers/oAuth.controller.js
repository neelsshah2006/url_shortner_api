const setCookie = require("../utils/setCookie.util");
const { sendSuccess } = require("../utils/response.util");

module.exports.callback = (req, res) => {
  const { user, token } = req.user;

  setCookie(res, "accessToken", token.accessToken);
  setCookie(res, "refreshToken", token.refreshToken);
  sendSuccess(res, "Google Authentication successful", { user }, 200);
};
