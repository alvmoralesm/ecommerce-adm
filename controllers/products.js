const Product = require("../models/products");
const Brand = require("../models/brands");
const catchAsync = require("../utils/catchAsync");
const currencyFormatter = require("../public/js/currencyFormatter");

module.exports.index = catchAsync(async (req, res) => {
  const products = await Product.find({});
  const formatter = currencyFormatter;

  res.render("products/index", { products, formatter });
});

module.exports.renderNewForm = catchAsync(async (req, res) => {
  res.render("products/new");
});

module.exports.createProduct = catchAsync(async (req, res) => {
  const product = new Product(req.body.product);

  await product.save();

  req.flash("success", "Created new product!");
  res.redirect(`/products`);
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    req.flash("error", "Product Not Found!");
    return res.redirect("/products");
  }
  res.render("products/edit", { product });
});

module.exports.deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted brand!");
  res.redirect("/products");
});

module.exports.getProductByName = catchAsync(async (req, res) => {
  /* const { name } = req.query; */
  let name = req.query.name;
  name = name.trim();
  let products;

  if (!name) {
    products = await Product.find({});
  } else if (name) {
    const regex = new RegExp(name, "i"); // i for case insensitive
    products = await Product.find({ name: { $regex: regex } });
  }

  res.render("products", { products });
});
