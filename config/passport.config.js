const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/oauth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const username = email?.split("@")[0];

        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }

        let user = await userModel.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
          const existingUsername = await userModel.findOne({ username });
          const uniqueUsername = existingUsername
            ? `${username}_${Date.now()}`
            : username;

          user = await userModel.create({
            fullName: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName || "Unknown",
            },
            username: uniqueUsername,
            email,
            authProvider: "google",
            googleId,
          });
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
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
