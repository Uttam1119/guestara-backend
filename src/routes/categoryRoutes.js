const express4 = require("express");
const routerCat = express4.Router();
const categoryController = require("../controllers/categoryController");

routerCat.post("/", categoryController.createCategory);
routerCat.get("/", categoryController.getAllCategories);
routerCat.get("/:idOrName", categoryController.getCategoryByIdOrName);
routerCat.put("/:id", categoryController.updateCategory);

module.exports = routerCat;
