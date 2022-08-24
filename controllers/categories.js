const Category = require("../models/categories");
const catchAsync = require("../utils/catchAsync");

module.exports.index = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  const title = "Categories";

  res.render("categories/index", { categories, title });
});

module.exports.renderNewForm = (req, res) => {
  const title = "New Category";

  res.render("categories/new", { title });
};

module.exports.createCategory = catchAsync(async (req, res, next) => {
  const category = new Category(req.body);

  await category.save();

  req.flash("success", "Successfully made a new category!");
  res.redirect("/categories");
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id).populate({
    path: "subcategories",
  });

  const title = `Edit ${category.name}`;

  if (!category) {
    req.flash("error", "Category Not Found!");
    return res.redirect("/categories");
  }

  res.render("categories/edit", { category, title });
});

module.exports.deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted category!");
  res.redirect("/categories");
});

module.exports.updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, {
    ...req.body,
  });
  await category.save();
  req.flash("success", "Successfully updated category!");
  res.redirect(`/categories/`);
});
