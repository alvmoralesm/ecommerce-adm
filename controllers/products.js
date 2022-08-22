const Product = require("../models/products");
const Brand = require("../models/brands");
const Category = require("../models/categories");
const Subcategory = require("../models/subcategories");
const catchAsync = require("../utils/catchAsync");
const currencyFormatter = require("../public/js/currencyFormatter");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");

module.exports.index = catchAsync(async (req, res) => {
  const products = await Product.find({})
    .populate("brand")
    .populate("category")
    .populate("subcategory");

  const categories = await Category.find({});
  const brands = await Brand.find({});

  const formatter = currencyFormatter;

  res.render("products/index", { products, categories, brands, formatter });
});

module.exports.renderNewForm = catchAsync(async (req, res) => {
  const brands = await Brand.find({});
  const categories = await Category.find({});
  const subcategories = await Subcategory.find({});

  res.render("products/new", { brands, categories, subcategories });
});

module.exports.createProduct = catchAsync(async (req, res) => {
  const product = new Product(req.body.product);
  console.log(product);
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

  if (!product) {
    req.flash("error", "Product Not Found!");
    return res.redirect("/products");
  }
  res.render("products/edit", { product });
});

module.exports.productDetails = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .populate("subcategory");

  console.log(product);
  if (!product) {
    req.flash("error", "Product Not Found!");
    return res.redirect("/products");
  }
  res.render("products/details", { product });
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
    console.log(product);
  }
  console.log(req.body);
  req.flash("success", "Succcessfully updated product!");
  res.redirect(`/products/`);
});

module.exports.getProductByName = catchAsync(async (req, res) => {
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

module.exports.getSubcategories = catchAsync(async (req, res) => {
  const id = req.params.id;
  let subcategories = [];

  if (parseInt(id) !== 0) {
    console.log(id);
    subcategories = await Subcategory.find({
      category: { _id: id },
    }).populate("category");
  }

  res.status(200).json(subcategories);
});

module.exports.getProductByFilter = catchAsync(async (req, res) => {
  let { name, category, subcategory, brand } = req.query;
  name = name.trim();
  category = category.trim();
  subcategory = subcategory.trim();
  brand = brand.trim();

  const formatter = currencyFormatter;
  const categories = await Category.find({});
  const brands = await Brand.find({});

  let products;

  const regex = new RegExp(name, "i"); // i for case insensitive

  if (category && name && subcategory && brand) {
    products = await Product.find({
      name: { $regex: regex },
      brand: mongoose.Types.ObjectId(brand),
      category: mongoose.Types.ObjectId(category),
      subcategory: mongoose.Types.ObjectId(subcategory),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  }
  if (!category && !name && !subcategory & !brand) {
    products = await Product.find({})
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (category && name) {
    products = await Product.find({
      name: { $regex: regex },
      category: mongoose.Types.ObjectId(category),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (subcategory && name) {
    products = await Product.find({
      name: { $regex: regex },
      subcategory: mongoose.Types.ObjectId(subcategory),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (category && subcategory) {
    products = await Product.find({
      category: mongoose.Types.ObjectId(category),
      subcategory: mongoose.Types.ObjectId(subcategory),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (brand && subcategory) {
    products = await Product.find({
      brand: mongoose.Types.ObjectId(brand),
      subcategory: mongoose.Types.ObjectId(subcategory),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (brand && category) {
    products = await Product.find({
      brand: mongoose.Types.ObjectId(brand),
      category: mongoose.Types.ObjectId(subcategory),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (brand && name) {
    products = await Product.find({
      name: { $regex: regex },
      brand: mongoose.Types.ObjectId(brand),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (name) {
    products = await Product.find({
      name: { $regex: regex },
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (category) {
    products = await Product.find({
      category: mongoose.Types.ObjectId(category),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (subcategory) {
    products = await Product.find({
      subcategory: mongoose.Types.ObjectId(subcategory),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  } else if (brand) {
    products = await Product.find({
      brand: mongoose.Types.ObjectId(brand),
    })
      .populate("brand")
      .populate("category")
      .populate("subcategory");
  }

  res.render("products", { products, categories, brands, formatter });
});
