const { brandSchema, productSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Brand = require("./models/brands");

module.exports.validateBrand = (req, res, next) => {
  const { error } = brandSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
