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
router.get("/:id/edit", products.renderEditForm);

router.delete("/:id", products.deleteProduct);

module.exports = router;
