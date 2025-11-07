const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Item = require("../models/Item");

exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, description, taxApplicable, tax, taxType } = req.body;
    const category = new Category({
      name,
      image,
      description,
      taxApplicable,
      tax,
      taxType,
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();

    const result = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await Subcategory.find({
          category: cat._id,
        }).lean();
        const subcatsWithItems = await Promise.all(
          subcategories.map(async (sub) => {
            const items = await Item.find({ subcategory: sub._id }).lean();
            return { ...sub, items };
          })
        );

        const items = await Item.find({
          category: cat._id,
          subcategory: null,
        }).lean();

        return { ...cat, subcategories: subcatsWithItems, items };
      })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getCategoryByIdOrName = async (req, res, next) => {
  try {
    const { idOrName } = req.params;
    const mongoose = require("mongoose");
    const query = mongoose.Types.ObjectId.isValid(idOrName)
      ? { _id: idOrName }
      : { name: idOrName };

    const category = await Category.findOne(query).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });

    const subcategories = await Subcategory.find({
      category: category._id,
    }).lean();
    const subcatsWithItems = await Promise.all(
      subcategories.map(async (sub) => {
        const items = await Item.find({ subcategory: sub._id }).lean();
        return { ...sub, items };
      })
    );

    const items = await Item.find({
      category: category._id,
      subcategory: null,
    }).lean();

    res.json({ ...category, subcategories: subcatsWithItems, items });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};
