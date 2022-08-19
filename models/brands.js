const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model("Brand", BrandSchema);
