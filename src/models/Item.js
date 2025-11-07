const mongoose3 = require("mongoose");

const ItemSchema = new mongoose3.Schema(
  {
    category: {
      type: mongoose3.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose3.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    taxApplicable: { type: Boolean },
    tax: { type: Number },
    baseAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

ItemSchema.index({ category: 1, subcategory: 1, name: 1 }, { unique: true });

module.exports = mongoose3.model("Item", ItemSchema);
