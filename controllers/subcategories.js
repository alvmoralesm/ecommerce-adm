const Subcategory = require("../models/subcategories");
const Category = require("../models/categories");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

module.exports.index = catchAsync(async (req, res) => {
  const subcategories = await Subcategory.find({}).populate("category");
  const categories = await Category.find({});

  subcategories.map((subcategory) => {
    for (let category of categories) {
      if (category.id == subcategory.category) {
        subcategory.category = category.name;
      }
    }
  });

  res.render("subcategories", { subcategories, categories });
});

module.exports.renderNewForm = catchAsync(async (req, res) => {
  const categories = await Category.find({});

  res.render("subcategories/new", { categories });
});

module.exports.createSubcategory = catchAsync(async (req, res, next) => {
  const subcategory = new Subcategory(req.body.subcategory);
  const category = await Category.findById(subcategory.category);

  category.subcategories.push(subcategory);

  await subcategory.save();
  await category.save();

  req.flash("success", "Successfully made a new subcategory!");
  res.redirect("/subcategories/");
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  const categories = await Category.find({});

  if (!subcategory) {
    req.flash("error", "Subcategory Not Found!");
    return res.redirect("/subcategories");
  }
  res.render("subcategories/edit", { subcategory, categories });
});

module.exports.deleteSubcategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  await Subcategory.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted subcategory!");
  res.redirect("/subcategories");
});

module.exports.editSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findByIdAndUpdate(id, {
    ...req.body.subcategory,
  });
  await subcategory.save();
  req.flash("success", "Successfully updated subcategory!");
  res.redirect(`/subcategories/`);
});

module.exports.getSubcategoryByFilter = catchAsync(async (req, res) => {
  /* const { name } = req.query; */
  let { name, category } = req.query;
  name = name.trim();
  category = category.trim();

  let subcategories;
  const categories = await Category.find({});
  const regex = new RegExp(name, "i"); // i for case insensitive

  console.log(name + category);

  if (category && name) {
    subcategories = await Subcategory.find({
      name: { $regex: regex },
      category: mongoose.Types.ObjectId(category),
    }).populate("category");
  } else if (category) {
    if (category == 1) {
      subcategories = await Subcategory.find({});
    }
    subcategories = await Subcategory.find({ category: category }).populate(
      "category"
    );
  } else if (name) {
    subcategories = await Subcategory.find({
      name: { $regex: regex },
    }).populate("category");
  } else if (!category && !name) {
    subcategories = await Subcategory.find({}).populate("category");
  }

  res.render("subcategories", { subcategories, categories });
});
