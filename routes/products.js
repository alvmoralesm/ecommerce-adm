const express = require("express");
const router = express.Router();
const products = require("../controllers/products");
const { validateProduct } = require("../middleware");

router
  .route("/")
  .get(products.index)
  .post(validateProduct, products.createProduct);

router.get("/search", products.getProductByName);

router.get("/new", products.renderNewForm);

router.delete("/:id", products.deleteProduct);

router
  .route("/:id")
  .put(validateProduct, products.editProduct)
  .delete(products.deleteProduct);

router.get("/:id/edit", products.renderEditForm);

module.exports = router;
