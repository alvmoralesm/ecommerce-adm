const express = require("express");
const router = express.Router();
const products = require("../controllers/products");
const { validateProduct } = require("../middleware");
const Subcategory = require("../models/subcategories");

router
  .route("/")
  .get(products.index)
  .post(validateProduct, products.createProduct);

router.get("/search", products.getProductByFilter);

router.get("/new", products.renderNewForm);

router.delete("/:id", products.deleteProduct);

router
  .route("/:id")
  .put(validateProduct, products.editProduct)
  .delete(products.deleteProduct);

router.get("/:id/edit", products.renderEditForm);

router.get("/get_subcategories/:id", products.getSubcategories);

module.exports = router;
