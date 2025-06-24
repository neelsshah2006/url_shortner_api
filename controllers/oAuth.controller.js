const setCookie = require("../utils/setCookie.util");

module.exports.callback = (req, res) => {
  const { user, token } = req.user;

  setCookie(res, "accessToken", token.accessToken);
  setCookie(res, "refreshToken", token.refreshToken);
  return res.redirect(
    `${process.env.FRONTEND_URL}/dashboard?success=Google_Auth_success`
  );
};
