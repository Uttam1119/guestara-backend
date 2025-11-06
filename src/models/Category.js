const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    taxApplicable: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    taxType: {
      type: String,
      enum: ["percentage", "fixed", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
