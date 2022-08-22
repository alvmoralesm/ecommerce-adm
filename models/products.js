const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
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
});

module.exports = mongoose.model("Product", ProductSchema);
