const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

urlSchema.methods.incrementVisitCount = async function () {
  this.visitCount += 1;
  await this.save();
};

module.exports = mongoose.model("url", urlSchema);
