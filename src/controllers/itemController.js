const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Item = require("../models/Item");

function computeTotal(baseAmount, discount) {
  const b = Number(baseAmount) || 0;
  const d = Number(discount) || 0;
  return Math.max(0, b - d);
}

exports.createItem = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { subcategoryId } = req.query;
    const payload = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    let subcategory = null;
    if (payload.subcategory || subcategoryId) {
      const sid = payload.subcategory || subcategoryId;
      subcategory = await Subcategory.findById(sid);
      if (!subcategory)
        return res.status(404).json({ error: "Subcategory not found" });
    }

    // derive tax defaults
    const taxApplicable =
      typeof payload.taxApplicable === "boolean"
        ? payload.taxApplicable
        : subcategory
        ? subcategory.taxApplicable
        : category.taxApplicable;

    const tax =
      typeof payload.tax === "number"
        ? payload.tax
        : subcategory
        ? subcategory.tax
        : category.tax;

    const baseAmount = Number(payload.baseAmount);
    const discount = Number(payload.discount || 0);
    const totalAmount = computeTotal(baseAmount, discount);

    const item = new Item({
      category: category._id,
      subcategory: subcategory ? subcategory._id : null,
      name: payload.name,
      image: payload.image || "",
      description: payload.description || "",
      taxApplicable,
      tax,
      baseAmount,
      discount,
      totalAmount,
    });

    await item.save();

    res.status(201).json({
      message: "Item created successfully",
      item: {
        id: item._id,
        name: item.name,
        description: item.description,
        category: category.name,
        subcategory: subcategory ? subcategory.name : null,
        totalAmount: item.totalAmount,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().lean();
    const result = await Promise.all(
      items.map(async (item) => {
        const category = await Category.findById(item.category).lean();
        const subcategory = item.subcategory
          ? await Subcategory.findById(item.subcategory).lean()
          : null;
        return {
          id: item._id,
          name: item.name,
          description: item.description,
          image: item.image,
          totalAmount: item.totalAmount,
          category: category?.name,
          subcategory: subcategory?.name || null,
        };
      })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getItemsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });

    const items = await Item.find({ category: categoryId }).lean();

    const formatted = await Promise.all(
      items.map(async (item) => {
        const subcategory = item.subcategory
          ? await Subcategory.findById(item.subcategory).lean()
          : null;
        return {
          id: item._id,
          name: item.name,
          description: item.description,
          totalAmount: item.totalAmount,
          category: category.name,
          subcategory: subcategory?.name || null,
        };
      })
    );

    res.json({ category: category.name, items: formatted });
  } catch (err) {
    next(err);
  }
};

exports.getItemsBySubcategory = async (req, res, next) => {
  try {
    const { subcategoryId } = req.params;
    const subcategory = await Subcategory.findById(subcategoryId).lean();
    if (!subcategory)
      return res.status(404).json({ error: "Subcategory not found" });

    const items = await Item.find({ subcategory: subcategoryId }).lean();
    const formatted = items.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      totalAmount: item.totalAmount,
      subcategory: subcategory.name,
    }));

    res.json({ subcategory: subcategory.name, items: formatted });
  } catch (err) {
    next(err);
  }
};

exports.getItemByIdOrName = async (req, res, next) => {
  try {
    const { idOrName } = req.params;
    const mongoose = require("mongoose");
    const query = mongoose.Types.ObjectId.isValid(idOrName)
      ? { _id: idOrName }
      : { name: idOrName };
    const item = await Item.findOne(query).lean();
    if (!item) return res.status(404).json({ error: "Item not found" });

    const category = await Category.findById(item.category).lean();
    const subcategory = item.subcategory
      ? await Subcategory.findById(item.subcategory).lean()
      : null;

    res.json({
      id: item._id,
      name: item.name,
      description: item.description,
      baseAmount: item.baseAmount,
      discount: item.discount,
      totalAmount: item.totalAmount,
      category: category?.name,
      subcategory: subcategory?.name || null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.baseAmount || updates.discount) {
      const existing = await Item.findById(id);
      if (!existing) return res.status(404).json({ error: "Item not found" });

      const baseAmount =
        updates.baseAmount !== undefined
          ? Number(updates.baseAmount)
          : existing.baseAmount;
      const discount =
        updates.discount !== undefined
          ? Number(updates.discount)
          : existing.discount;
      updates.totalAmount = Math.max(0, baseAmount - discount);
    }

    const item = await Item.findByIdAndUpdate(id, updates, { new: true });
    if (!item) return res.status(404).json({ error: "Item not found" });

    const category = await Category.findById(item.category).lean();
    const subcategory = item.subcategory
      ? await Subcategory.findById(item.subcategory).lean()
      : null;

    res.json({
      message: "Item updated successfully",
      item: {
        id: item._id,
        name: item.name,
        description: item.description,
        category: category?.name,
        subcategory: subcategory?.name || null,
        totalAmount: item.totalAmount,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchItems = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const items = await Item.find({ name: regex }).lean();

    const formatted = await Promise.all(
      items.map(async (item) => {
        const category = await Category.findById(item.category).lean();
        const subcategory = item.subcategory
          ? await Subcategory.findById(item.subcategory).lean()
          : null;
        return {
          id: item._id,
          name: item.name,
          category: category?.name,
          subcategory: subcategory?.name || null,
          totalAmount: item.totalAmount,
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};
