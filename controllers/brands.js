const Brand = require("../models/brands");
const catchAsync = require("../utils/catchAsync");

module.exports.index = catchAsync(async (req, res) => {
  const brands = await Brand.find({});
  const title = "Brands";

  res.render("brands/index", { brands, title });
});

module.exports.renderNewForm = (req, res) => {
  const title = "New Brand";

  res.render("brands/new", { title });
};

module.exports.createBrand = catchAsync(async (req, res, next) => {
  const brand = new Brand(req.body);

  await brand.save();

  req.flash("success", "Successfully made a new brand!");
  res.redirect("/brands");
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  const title = `Edit ${brand.name}`;

  if (!brand) {
    req.flash("error", "Brand Not Found!");
    return res.redirect("/brands");
  }
  res.render("brands/edit", { brand, title });
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
    ...req.body,
  });
  await brand.save();
  req.flash("success", "Successfully updated brand!");
  res.redirect(`/brands/`);
});
