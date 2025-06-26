const isProd = process.env.NODE_ENV === "production";

const setCookie = (res, tokenName, token) => {
  return res.cookie(tokenName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = setCookie;
