const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
  name: String,
  description: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

SubcategorySchema.post("findOneAndDelete", async function (doc) {
  const category = await mongoose
    .model("Category")
    .findById(mongoose.Types.ObjectId(doc.category));

  category.subcategories.pull(mongoose.Types.ObjectId(doc.id));
  await category.save();
});

module.exports = mongoose.model("Subcategory", SubcategorySchema);
