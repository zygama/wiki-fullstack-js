const { Router } = require('express');
const ArticleModel = require('../../models/articles');
const ArticleVersionnedModel = require('../../models/articleVersionned');

const routes = Router();

/**
 * @api {GET} /api/events Get all events
 * @apiName GetArticles
 * @apiGroup Articles
 * @apiDescription Get all articles
 */
// routes.get('/', async (req, res) => {
//    try {
//       res.status(200).json(query);
//    } catch (error) {
//       console.error(error);
//       res.status(500).send(error);
//    }
// });

/**
* @api {POST} /api/articles Create article
* @apiName PostArticle
* @apiGroup Articles
* @apiDescription create an article
*/
routes.post('/', async (req, res) => {
   try {
      const newArticle = new ArticleModel({ ...req.body });
      await newArticle.save();

      const newArticleVersionned = new ArticleVersionnedModel();
      await newArticleVersionned.save();

      await newArticle.updateOne({ idArticleVersionned: newArticleVersionned.id });
      await newArticle.save();

      await newArticleVersionned.updateOne({ history: [newArticle.id] });
      await newArticleVersionned.save();

      res.status(200).send('ok');
   } catch (error) {
      console.log(error);
      res.status(500).send(error);
   }
});

/**
* @api {GET} /api/events/:id Get articles from categorie id
* @apiName GetArticlesFromCategorieId
* @apiGroup Articles
* @apiDescription Get an event via categorie id
*
* @apiParam {ObjectId} id Categorie unique ID.
*/
// routes.get('/categorie/:id', async (req, res) => {
//
//    ArticleModel.find({ categorie: req.params.id }, (err, articles) => {
//       const finalArray = [];
//       articles.forEach(article => {
//          ArticleVersionnedModel.find({ _id: article.idArticleVersionned }, (error, articlesVersionned) => {
//             if (error) {
//                console.log(error);
//                res.status(500).send(error);
//             } else {
//                articlesVersionned.forEach(articleVersionned => {
//                   const articleVersionnedHistoryLength = articleVersionned.history.length;
//                   if (article.id == articleVersionned.history[articleVersionnedHistoryLength - 1]) {
//                      console.log(finalArray.isArray());
//                      // finalArray.forEach(item => {
//                      //    console.log('item', item);
//                      //    // if (!item.idArticleVersionned === article.id) {
//                      //    //    finalArray.push(article);
//                      //    // }
//                      // });
//                      //console.log(finalArray);
//                   }
//                   res.status(200).json(finalArray);
//                });
//             }
//          });
//       });
//       //res.status(200).json(finalArray);
//    });
// });

/**
* @api {GET} /api/articles/:id Get an article from his id
* @apiName GetArticle
* @apiGroup Articles
* @apiDescription Get an article from his id
*
* @apiParam {ObjectId} id Article unique ID.
*/
routes.get('/:id', (req, res) => {
   // get the article from the id
   const articleId = req.params.id;
   ArticleModel.findById(articleId, (err, result) => {
      if (err) {
         console.log(err);
         res.status(500).json(err);
      } else {
         console.log(result);
         res.status(200).json(result);
      }
   });
});

routes.post('/update', (req, res) => {
   // get modified values (title, content, categorie, tags)
   // get unmodified value (idArticleVersionned)
   console.log('req.body', req.body);
   const updatedArticle = new ArticleModel({ ...req.body });
   const idArticleVersionned = updatedArticle.idArticleVersionned.toString();
   ArticleVersionnedModel.findById(idArticleVersionned, (err, result) => {
      if (err) {
         console.log(err);
         res.status(500).json(err);
      } else {
         console.log('result', result);
         result.history.push(updatedArticle.id);
         result.save();
         updatedArticle.save();
         res.status(200).json('updated');
      }
   });
});

/**
* @api {GET} /api/articles/tag/:tagName Get articles from tag
* @apiName DeleteEvent
* @apiGroup Events
* @apiDescription Delete an event via his id
*
* @apiParam {ObjectId} id Event unique ID.
*/
routes.get('/tag/:tagName', async (req, res) => {
   const { tagName } = req.params;
   const arrayLastArticles = [];
   let arrayArticlesTagged = [];
   const arrayArticlesResult = [];

   try {
      const allArticlesVersionned = await ArticleVersionnedModel.find();
      console.log(allArticlesVersionned);
      // Put all last articles inside "arrayLastArticles"
      allArticlesVersionned.forEach((articleVersionned) => {
         arrayLastArticles.push(articleVersionned.history[articleVersionned.history.length - 1].toString());
      });
      console.log(arrayLastArticles);

      // Search for articles with specified tag
      arrayArticlesTagged = await ArticleModel.find({ tags: tagName });
      console.log(arrayArticlesTagged);

      // Check if articles getted with tag is a last article
      arrayArticlesTagged.forEach(articleTagged => {
         console.log(articleTagged._id);
         if (arrayLastArticles.includes(articleTagged._id.toString())) {
            arrayArticlesResult.push(articleTagged);
         }
      });

      res.status(200).json(arrayArticlesResult);
   } catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
});
/**
* @api {GET} /api/articles/title/:id Get articles from tag
* @apiName DeleteEvent
* @apiGroup Events
* @apiDescription Delete an event via his id
*
* @apiParam {ObjectId} id Event unique ID.
*/
routes.get('/title/:id', async (req, res) => {
   const title = req.params.id;
   const arrayLastArticles = [];
   const arrayArticles = [];

   ArticleVersionnedModel.find().then(articlesVersionned => {
      articlesVersionned.forEach(articleVersionned => {
         const { length } = articleVersionned.history;
         arrayLastArticles.push(articleVersionned.history[length - 1]);
      });
      arrayLastArticles.forEach(lastArticle => {
         console.log(lastArticle);
         ArticleModel.find({ _id: lastArticle }).then(article => {
            if (article[0].title === title) {
               arrayArticles.push(article);
            }
            console.log(arrayArticles);
            // res.status(200).json(arrayArticles);
         });
      });
      // res.status(200).json(arrayArticles[0]);
   }).catch(err => {
      res.status(500).json(err);
   });
});

routes.delete('/:id', (req, res) => {
   const articleId = req.params.id;

   ArticleModel.findById(articleId)
      .then(event => {
         ArticleModel.find({ idArticleVersionned: event.idArticleVersionned }).then((articles) => {
            articles.forEach((article) => {
               article.remove();
            });
         });
         ArticleVersionnedModel.find({ _id: event.idArticleVersionned }).then((articleVersionned) => {
            console.log(articleVersionned[0]);
            articleVersionned[0].remove();
         });
         res.status(200).json('deleted success');
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(err);
      });
});

module.exports = routes;
