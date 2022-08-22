const Brand = require("../models/brands");
const catchAsync = require("../utils/catchAsync");

module.exports.index = catchAsync(async (req, res) => {
  const brands = await Brand.find({});

  res.render("brands/index", { brands });
});

module.exports.renderNewForm = (req, res) => {
  res.render("brands/new");
};

module.exports.createBrand = catchAsync(async (req, res, next) => {
  const brand = new Brand(req.body.brand);

  await brand.save();

  req.flash("success", "Successfully made a new brand!");
  res.redirect("/brands");
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    req.flash("error", "Brand Not Found!");
    return res.redirect("/brands");
  }
  res.render("brands/edit", { brand });
});

module.exports.deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Brand.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted brand!");
  res.redirect("/brands");
});

module.exports.updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndUpdate(id, {
    ...req.body.brand,
  });
  await brand.save();
  req.flash("success", "Successfully updated brand!");
  res.redirect(`/brands/`);
});

module.exports.getBrandByName = catchAsync(async (req, res) => {
  let name = req.query.name;
  name = name.trim();
  let brands;

  if (!name) {
    brands = await Brand.find({});
  } else if (name) {
    const regex = new RegExp(name, "i"); // i for case insensitive
    brands = await Brand.find({ name: { $regex: regex } });
  }

  res.render("brands", { brands });
});
