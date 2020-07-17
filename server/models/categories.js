const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const CategorySchema = new Schema({
   title: { type: String, required: true, unique: true }
}, {
   timestamps: true
});

CategorySchema.plugin(uniqueValidator);

const Categories = mongoose.model('categories', CategorySchema);

module.exports = Categories;
