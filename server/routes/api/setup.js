const { Router } = require('express');
const mongoose = require('mongoose');
const CategorieModel = require('../../models/categories');
const ArticleVersionnedModel = require('../../models/articleVersionned');
const ArticleModel = require('../../models/articles');

const routes = Router();

/**
 * @api {GET} /api/setup Setup the app
 * @apiName POST
 * @apiGroup Setup
 * @apiDescription
 */
routes.get('/', async (req, res) => {
   try {
      // suppression des collections si elles existent
      await mongoose.connection.db.listCollections().toArray(async (err, names) => {
         if (err) {
            console.log(err);
         } else {
            names.forEach(name => {
               if (name.name.includes('categories')) {
                  mongoose.connection.db.dropCollection('categories', (error) => {
                     if (error) {
                        console.log(error);
                        res.status(500).send('error drop collection categories');
                     }
                  });
               } else if (name.name.includes('articles')) {
                  mongoose.connection.db.dropCollection('articles', (error) => {
                     if (error) {
                        console.log(error);
                        res.status(500).send('error drop collection articles');
                     }
                  });
               } else if (name.name.includes('articleversionneds')) {
                  mongoose.connection.db.dropCollection('articleversionneds', (error) => {
                     if (error) {
                        console.log(error);
                        res.status(500).send('error drop collection articleVersionned');
                     }
                  });
               }
            });

            // SETUP CATEGORIES - ArticlesVersionned - Articles
            const informatique = {
               title: 'informatique'
            };

            const sciences = {
               title: 'sciences'
            };

            const politique = {
               title: 'politique'
            };

            const informatiqueCategorie = new CategorieModel(informatique);
            await informatiqueCategorie.save();
            const infoArticleVersionned = new ArticleVersionnedModel();
            await infoArticleVersionned.save();
            const infoArticle = new ArticleModel({
               title: 'L\'informatique pour les nuls',
               content: 'J\'adore l\'informatique c\'est trop bien',
               categorie: informatiqueCategorie.id,
               tags: ['jquery', 'js', 'node'],
               idArticleVersionned: infoArticleVersionned.id
            });
            await infoArticle.save();
            await infoArticleVersionned.updateOne({ history: [infoArticle.id] });
            await infoArticleVersionned.save();


            const sciencesCategorie = new CategorieModel(sciences);
            await sciencesCategorie.save();
            const sciencesArticleVersionned = new ArticleVersionnedModel();
            await sciencesArticleVersionned.save();
            const sciencesArticle = new ArticleModel({
               title: 'La sciences pour les nuls',
               content: 'J\'adore la sciences c\'est trop bien',
               categorie: sciencesCategorie.id,
               tags: ['chromosomes', 'adn', 'evolution'],
               idArticleVersionned: sciencesArticleVersionned.id
            });
            await sciencesArticle.save();
            await sciencesArticleVersionned.updateOne({ history: [sciencesArticle.id] });
            await sciencesArticleVersionned.save();

            const politiqueCategorie = new CategorieModel(politique);
            await politiqueCategorie.save();
            const politiqueArticleVersionned = new ArticleVersionnedModel();
            await politiqueArticleVersionned.save();
            const politiqueArticle = new ArticleModel({
               title: 'La politique pour les nuls',
               content: 'J\'adore la politique c\'est trop bien',
               categorie: politiqueCategorie.id,
               tags: ['balkany', 'argent', 'prison'],
               idArticleVersionned: politiqueArticleVersionned.id
            });
            await politiqueArticle.save();
            await politiqueArticleVersionned.updateOne({ history: [politiqueArticle.id] });
            await politiqueArticleVersionned.save();

            res.status(201).json('BASE OK');
         }
      });
   } catch (error) {
      console.log(error);
      res.status(500).send(error);
   }
});

module.exports = routes;
