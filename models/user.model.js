const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: [
        {
          token: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  this.cleanupExpiredTokens(false);

  // Enforce device limit (default to 5 if not set)
  const MAX_DEVICES = parseInt(process.env.MAX_DEVICES, 10) || 5;
  if (this.refreshToken.length >= MAX_DEVICES) {
    this.refreshToken.shift();
    console.log(
      `Device limit reached for user ${this._id}. Removed oldest session.`
    );
  }

  this.refreshToken.push({
    token: token,
    createdAt: new Date(),
  });

  await this.save();
  return token;
};

userSchema.methods.generateAuthToken = async function () {
  const accessToken = this.generateAccessToken();
  const refreshToken = await this.generateRefreshToken();
  return { accessToken, refreshToken };
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  const rounds = parseInt(process.env.ROUNDS, 10) || 10;
  return await bcrypt.hash(password, rounds);
};

userSchema.methods.cleanupExpiredTokens = function (saveDocument = true) {
  const validTokens = [];

  for (const tokenObj of this.refreshToken) {
    try {
      const tokenString =
        typeof tokenObj === "string" ? tokenObj : tokenObj.token;
      const decoded = jwt.decode(tokenString);

      if (!decoded || !decoded.exp) {
        continue;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        continue;
      }

      if (typeof tokenObj === "string") {
        validTokens.push({
          token: tokenString,
          createdAt: new Date(),
        });
      } else {
        validTokens.push(tokenObj);
      }
    } catch (error) {
      continue;
    }
  }

  this.refreshToken = validTokens;
  if (saveDocument) {
    return this.save();
  }

  return Promise.resolve(this);
};

userSchema.methods.removeRefreshToken = function (tokenToRemove) {
  this.refreshToken = this.refreshToken.filter((tokenObj) => {
    const tokenString =
      typeof tokenObj === "string" ? tokenObj : tokenObj.token;
    return tokenString !== tokenToRemove;
  });
  return this.save();
};

userSchema.methods.getActiveDeviceCount = function () {
  this.cleanupExpiredTokens(false);
  return this.refreshToken.length;
};

userSchema.statics.cleanupAllExpiredTokens = async function () {
  const users = await this.find({ refreshToken: { $exists: true, $ne: [] } });
  const bulkOps = [];

  for (const user of users) {
    const validTokens = [];

    for (const tokenObj of user.refreshToken) {
      try {
        const tokenString =
          typeof tokenObj === "string" ? tokenObj : tokenObj.token;
        const decoded = jwt.decode(tokenString);

        if (!decoded || !decoded.exp) {
          continue;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          continue;
        }

        // Keep the token in the new format
        if (typeof tokenObj === "string") {
          // Convert old format to new format
          validTokens.push({
            token: tokenString,
            createdAt: new Date(),
          });
        } else {
          validTokens.push(tokenObj);
        }
      } catch (error) {
        continue;
      }
    }

    if (validTokens.length !== user.refreshToken.length) {
      bulkOps.push({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { refreshToken: validTokens } },
        },
      });
    }
  }

  if (bulkOps.length > 0) {
    await this.bulkWrite(bulkOps);
  }

  return bulkOps.length;
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
