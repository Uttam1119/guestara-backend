const express = require("express");
const router = express.Router();

const categoryRoutes = require("./categoryRoutes");
const subCategoryRoutes = require("./subCategoryRoutes");
const itemRoutes = require("./itemRoutes");

router.use("/categories", categoryRoutes);
router.use("/subcategories", subCategoryRoutes);
router.use("/items", itemRoutes);

module.exports = router;
