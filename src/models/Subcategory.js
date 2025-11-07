const mongoose2 = require("mongoose");

const SubcategorySchema = new mongoose2.Schema(
  {
    category: {
      type: mongoose2.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    taxApplicable: { type: Boolean },
    tax: { type: Number },
  },
  { timestamps: true }
);

SubcategorySchema.index({ category: 1, name: 1 }, { unique: true });

module.exports = mongoose2.model("Subcategory", SubcategorySchema);
