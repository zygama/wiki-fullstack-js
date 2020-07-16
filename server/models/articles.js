const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const ArticleSchema = new Schema({
   title: { type: String, required: true },
   content: { type: String, required: true },
   categorie: { type: ObjectId, ref: 'categories' },
   tags: [{ type: String }],
   idArticleVersionned: { type: ObjectId, ref: 'articleVersionned' }
}, {
   timestamps: true
});

ArticleSchema.plugin(uniqueValidator);

const Events = mongoose.model('events', ArticleSchema);

module.exports = Events;
