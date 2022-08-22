const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const ProductSchema = new Schema(
  {
    name: String,
    images: [ImageSchema],
    description: String,
    price: Number,
    stock: Number,
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  },
  opts
);

module.exports = mongoose.model("Product", ProductSchema);
