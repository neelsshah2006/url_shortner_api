const mongoose = require("mongoose");

const clickSchema = mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "url",
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
      select: false,
    },
    continent: {
      type: String,
      default: "Unknown",
    },
    country: {
      type: String,
      default: "Unknown",
    },
    state: {
      type: String,
      default: "Unknown",
    },
    city: {
      type: String,
      default: "Unknown",
    },
    location: {
      type: {
        ltd: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    browser: {
      type: String,
      default: "Unknown",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      default: "Unknown",
    },
    userAgent: {
      type: String,
      default: "Unknown",
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("click", clickSchema);
