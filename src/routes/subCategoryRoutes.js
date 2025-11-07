const express5 = require("express");
const routerSub = express5.Router();
const subController = require("../controllers/subCategoryController");

routerSub.post("/category/:categoryId", subController.createSubcategory);
routerSub.get("/", subController.getAllSubcategories);
routerSub.get(
  "/category/:categoryId",
  subController.getSubcategoriesByCategory
);
routerSub.get("/:idOrName", subController.getSubcategoryByIdOrName);
routerSub.put("/:id", subController.updateSubcategory);

module.exports = routerSub;
