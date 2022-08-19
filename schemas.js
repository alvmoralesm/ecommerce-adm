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
    description: Joi.string().escapeHTML(),
  }),
});

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().escapeHTML().required(),
    description: Joi.string().escapeHTML(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0),
  }),
});
