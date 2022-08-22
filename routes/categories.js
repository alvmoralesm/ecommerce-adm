const express = require("express");
const router = express.Router();
const categories = require("../controllers/categories");
const { validateCategory } = require("../middleware");

router
  .route("/")
  .get(categories.index)
  .post(validateCategory, categories.createCategory);

router.get("/search", categories.getCategoryByName);

router.get("/new", categories.renderNewForm);

router
  .route("/:id")
  .put(validateCategory, categories.updateCategory)
  .delete(categories.deleteCategory);

router.get("/:id/edit", categories.renderEditForm);

module.exports = router;
