const express = require("express");
const router = express.Router();
const products = require("../controllers/products");
const { validateProduct } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .get(products.index)
  .post(upload.array("image"), validateProduct, products.createProduct);

router.get("/search", products.getProductByFilter);

router.get("/new", products.renderNewForm);

router.delete("/:id", products.deleteProduct);

router
  .route("/:id")
  .get(products.productDetails)
  .put(upload.array("image"), validateProduct, products.updateProduct)
  .delete(products.deleteProduct);

router.get("/:id/edit", products.renderEditForm);

router.get("/get_subcategories/:id", products.getSubcategories);

module.exports = router;
