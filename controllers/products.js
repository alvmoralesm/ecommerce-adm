const Product = require("../models/products");
const Brand = require("../models/brands");
const Category = require("../models/categories");
const Subcategory = require("../models/subcategories");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");

module.exports.index = catchAsync(async (req, res) => {
  const products = await Product.find({})
    .populate("brand")
    .populate("category")
    .populate("subcategory");

  const categories = await Category.find({});
  const brands = await Brand.find({});
  const title = "Products";

  res.render("products/index", { products, categories, brands, title });
});

module.exports.renderNewForm = catchAsync(async (req, res) => {
  const brands = await Brand.find({});
  const categories = await Category.find({});
  const subcategories = await Subcategory.find({});

  const title = "New Product";

  res.render("products/new", { brands, categories, subcategories, title });
});

module.exports.createProduct = catchAsync(async (req, res) => {
  const product = new Product(req.body.product);
  product.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  await product.save();

  req.flash("success", "Created new product!");
  res.redirect(`/products`);
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const title = `Edit ${product.name}`;

  if (!product) {
    req.flash("error", "Product Not Found!");
    return res.redirect("/products");
  }
  res.render("products/edit", { product, title });
});

module.exports.productDetails = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .populate("subcategory");

  const title = product.name;

  if (!product) {
    req.flash("error", "Product Not Found!");
    return res.redirect("/products");
  }
  res.render("products/details", { product, title });
});

module.exports.deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted product!");
  res.redirect("/products");
});

module.exports.updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, {
    ...req.body.product,
  });

  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  product.images.push(...imgs);
  await product.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne(
      {
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      },
      { new: true }
    );
  }
  req.flash("success", "Succcessfully updated product!");
  res.redirect("/products/");
});
