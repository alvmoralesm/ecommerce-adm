const {
  brandSchema,
  productSchema,
  categorySchema,
  subcategorySchema,
} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Brand = require("./models/brands");

module.exports.validateBrand = (req, res, next) => {
  const { error } = brandSchema.validate({ brand: req.body });
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate();
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate({ category: req.body });
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateSubcategory = (req, res, next) => {
  const { error } = subcategorySchema.validate({ subcategory: req.body });
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
