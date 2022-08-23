const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.brandSchema = Joi.object({
  brand: Joi.object({
    name: Joi.string().escapeHTML().required(),
    description: Joi.string().allow(null, ""),
  }),
});

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML().allow(null, ""),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    brand: Joi.string().escapeHTML().allow(null, ""),
    category: Joi.string().escapeHTML().allow(null, ""),
    subcategory: Joi.string().escapeHTML().allow(null, ""),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.categorySchema = Joi.object({
  category: Joi.object({
    name: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML().allow(null, ""),
  }),
});

module.exports.subcategorySchema = Joi.object({
  subcategory: Joi.object({
    name: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML().allow(null, ""),
    category: Joi.string().escapeHTML().required(),
  }),
});
