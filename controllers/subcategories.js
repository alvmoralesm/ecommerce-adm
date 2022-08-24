const Subcategory = require("../models/subcategories");
const Category = require("../models/categories");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

module.exports.index = catchAsync(async (req, res) => {
  const subcategories = await Subcategory.find({}).populate("category");
  const categories = await Category.find({});
  const title = "Subcategories";

  subcategories.map((subcategory) => {
    for (let category of categories) {
      if (category.id == subcategory.category) {
        subcategory.category = category.name;
      }
    }
  });

  res.render("subcategories", { subcategories, categories, title });
});

module.exports.renderNewForm = catchAsync(async (req, res) => {
  const categories = await Category.find({});

  res.render("subcategories/new", { categories });
});

module.exports.createSubcategory = catchAsync(async (req, res, next) => {
  const subcategory = new Subcategory(req.body);
  const category = await Category.findById(subcategory.category);

  category.subcategories.push(subcategory);

  await subcategory.save();
  await category.save();

  req.flash("success", "Successfully made a new subcategory!");
  res.redirect("/subcategories/");
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id).populate(
    "category"
  );
  const categories = await Category.find({});

  if (!subcategory) {
    req.flash("error", "Subcategory Not Found!");
    return res.redirect("/subcategories");
  }
  res.render("subcategories/edit", { subcategory, categories, mongoose });
});

module.exports.deleteSubcategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  await Subcategory.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted subcategory!");
  res.redirect("/subcategories");
});

module.exports.updateSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findByIdAndUpdate(id, {
    ...req.body,
  });

  await subcategory.save();
  req.flash("success", "Successfully updated subcategory!");
  res.redirect(`/subcategories/`);
});
