const express = require("express");
const router = express.Router();
const brands = require("../controllers/brands");
const { validateBrand } = require("../middleware");

router.route("/").get(brands.index).post(validateBrand, brands.createBrand);

router.get("/search", brands.getBrandByName);

router.get("/new", brands.renderNewForm);

router.delete("/:id", brands.deleteBrand);

router
  .route("/:id")
  .put(validateBrand, brands.editBrand)
  .delete(brands.deleteBrand);

router.get("/:id/edit", brands.renderEditForm);

module.exports = router;