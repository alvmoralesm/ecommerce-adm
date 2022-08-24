const express = require("express");
const router = express.Router();
const brands = require("../controllers/brands");
const { validateBrand } = require("../middleware");
const Brand = require("../models/brands");
const catchAsync = require("../utils/catchAsync");

router.route("/").get(brands.index).post(validateBrand, brands.createBrand);

router.get("/search", brands.getBrandByName);

router.get("/new", brands.renderNewForm);

router
  .route("/:id")
  .put(validateBrand, brands.updateBrand)
  .delete(brands.deleteBrand);

router.get("/:id/edit", brands.renderEditForm);

router.get(
  "/data",
  catchAsync(async (req, res) => {
    let brands = await Brand.find({});
    brands = JSON.stringify(brands);

    res.send(brands);
  })
);

module.exports = router;
