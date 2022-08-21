const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: String,
  description: String,
  subcategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
});

CategorySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Subcategory").deleteMany({
      _id: {
        $in: doc.subcategories,
      },
    });
  }
});

module.exports = mongoose.model("Category", CategorySchema);
