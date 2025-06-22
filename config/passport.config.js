const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/oauth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userByGoogleId = await userModel.findOne({
          googleId: profile.id,
        });
        const userByEmailId = await userModel.findOne({
          email: profile.emails[0].value,
        });
        let user = userByEmailId || userByGoogleId;
        if (!userByGoogleId && !userByEmailId) {
          user = await userModel.create({
            fullName: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName || "Unknown",
            },
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            authProvider: "google",
            googleId: profile.id,
          });
        } else if (!userByGoogleId && userByEmailId) {
          user = await userModel.findOneAndUpdate(
            { email: profile.emails[0].value },
            { googleId: profile.id }
          );
        }

        await user.cleanupExpiredTokens(true);
        const token = await user.generateAuthToken();

        return done(null, { user, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
