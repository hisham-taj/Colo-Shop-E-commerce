const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true, 
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  salesCount: {
    type: Number,
    default: 0,
  }
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory', // Correctly references the Subcategory model
  }],
});

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Correctly references the Category model
    required: true,
  },
});


module.exports = {
  Category : mongoose.model('Category', CategorySchema),
  product : mongoose.model('Product', productSchema),
  subCategory  : mongoose.model('Subcategory', SubcategorySchema)
}


