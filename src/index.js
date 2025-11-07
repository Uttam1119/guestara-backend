const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Guestara Menu Backend" });
});

const router = express.Router();
router.use("/categories", categoryRoutes);
router.use("/subcategories", subCategoryRoutes);
router.use("/items", itemRoutes);
app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
