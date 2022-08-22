const Category = require("../models/categories");
const catchAsync = require("../utils/catchAsync");

module.exports.index = catchAsync(async (req, res) => {
  const categories = await Category.find({});

  res.render("categories/index", { categories });
});

module.exports.renderNewForm = (req, res) => {
  res.render("categories/new");
};

module.exports.createCategory = catchAsync(async (req, res, next) => {
  const category = new Category(req.body.category);

  await category.save();

  req.flash("success", "Successfully made a new category!");
  res.redirect("/categories");
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id).populate({
    path: "subcategories",
  });

  console.log(category.subcategories);

  if (!category) {
    req.flash("error", "Category Not Found!");
    return res.redirect("/categories");
  }

  res.render("categories/edit", { category });
});

module.exports.deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted category!");
  res.redirect("/categories");
});

module.exports.editCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, {
    ...req.body.category,
  });
  await category.save();
  req.flash("success", "Successfully updated category!");
  res.redirect(`/categories/`);
});

module.exports.getCategoryByName = catchAsync(async (req, res) => {
  let name = req.query.name;
  name = name.trim();
  let categories;

  if (!name) {
    categories = await Category.find({});
  } else if (name) {
    const regex = new RegExp(name, "i"); // i for case insensitive
    categories = await Category.find({ name: { $regex: regex } });
  }

  res.render("categories", { categories });
});
