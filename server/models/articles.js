const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const ArticleSchema = new Schema({
   title: { type: String, required: true },
   content: { type: String, required: true },
   categorie: { type: ObjectId, required: true, ref: 'categories' },
   tags: [{ type: String }],
   idArticleVersionned: { type: ObjectId, ref: 'articleVersionned' }
}, {
   timestamps: true
});

ArticleSchema.plugin(uniqueValidator);

const Articles = mongoose.model('articles', ArticleSchema);

module.exports = Articles;
