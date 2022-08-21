const express = require("express");
const router = express.Router();
const subcategories = require("../controllers/subcategories");
const { validateSubcategory } = require("../middleware");

router
  .route("/")
  .get(subcategories.index)
  .post(validateSubcategory, subcategories.createSubcategory);

router.get("/search", subcategories.getSubcategoryByFilter);

router.get("/new", subcategories.renderNewForm);

router
  .route("/:id")
  .put(validateSubcategory, subcategories.editSubCategory)
  .delete(subcategories.deleteSubcategory);

router.get("/:id/edit", subcategories.renderEditForm);

module.exports = router;
