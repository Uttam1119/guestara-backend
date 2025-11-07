const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Item = require("../models/Item");

exports.createSubcategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, image, description, taxApplicable, tax } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const subcat = new Subcategory({
      category: category._id,
      name,
      image,
      description,
      taxApplicable:
        typeof taxApplicable === "boolean"
          ? taxApplicable
          : category.taxApplicable,
      tax: typeof tax === "number" ? tax : category.tax,
    });

    await subcat.save();
    res.status(201).json(subcat);
  } catch (err) {
    next(err);
  }
};

exports.getAllSubcategories = async (req, res, next) => {
  try {
    const subcategories = await Subcategory.find().lean();
    const result = await Promise.all(
      subcategories.map(async (sub) => {
        const items = await Item.find({ subcategory: sub._id }).lean();
        return { ...sub, items };
      })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getSubcategoriesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({
      category: categoryId,
    }).lean();
    const result = await Promise.all(
      subcategories.map(async (sub) => {
        const items = await Item.find({ subcategory: sub._id }).lean();
        return { ...sub, items };
      })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getSubcategoryByIdOrName = async (req, res, next) => {
  try {
    const { idOrName } = req.params;
    const mongoose = require("mongoose");
    const query = mongoose.Types.ObjectId.isValid(idOrName)
      ? { _id: idOrName }
      : { name: idOrName };

    const sub = await Subcategory.findOne(query).lean();
    if (!sub) return res.status(404).json({ error: "Subcategory not found" });

    const items = await Item.find({ subcategory: sub._id }).lean();
    res.json({ ...sub, items });
  } catch (err) {
    next(err);
  }
};

exports.updateSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const sub = await Subcategory.findByIdAndUpdate(id, updates, { new: true });
    if (!sub) return res.status(404).json({ error: "Subcategory not found" });
    res.json(sub);
  } catch (err) {
    next(err);
  }
};
