const express = require("express");
const router = express.Router();
const subcategories = require("../controllers/subcategories");
const { validateSubcategory } = require("../middleware");

router
  .route("/")
  .get(subcategories.index)
  .post(validateSubcategory, subcategories.createSubcategory);

router.get("/new", subcategories.renderNewForm);

router
  .route("/:id")
  .put(validateSubcategory, subcategories.updateSubCategory)
  .delete(subcategories.deleteSubcategory);

router.get("/:id/edit", subcategories.renderEditForm);

module.exports = router;
