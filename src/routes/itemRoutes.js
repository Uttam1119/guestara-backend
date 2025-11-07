const express6 = require("express");
const routerItem = express6.Router();
const itemController = require("../controllers/itemController");

routerItem.post("/category/:categoryId", itemController.createItem);
routerItem.get("/", itemController.getAllItems);
routerItem.get("/category/:categoryId", itemController.getItemsByCategory);
routerItem.get(
  "/subcategory/:subcategoryId",
  itemController.getItemsBySubcategory
);
routerItem.get("/search", itemController.searchItems);
routerItem.get("/:idOrName", itemController.getItemByIdOrName);
routerItem.put("/:id", itemController.updateItem);

module.exports = routerItem;
