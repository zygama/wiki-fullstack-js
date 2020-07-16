/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const ArticleVersionnedSchema = new Schema({
   history: [{ type: ObjectId, ref: 'articles' }]
}, {
   timestamps: true
});

ArticleVersionnedSchema.plugin(uniqueValidator);

const Events = mongoose.model('articleVersionned', ArticleVersionnedSchema);

module.exports = Events;
