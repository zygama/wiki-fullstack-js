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
routes.get('/categorie/:id', async (req, res) => {
   ArticleModel.find({ categorie: req.params.id })
      .then((articles) => {
         res.status(200).json(articles);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send(err);
      });
});

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
   const updatedArticle = new ArticleModel({ ...req.body });
   console.log(updatedArticle);
   const idArticleVersionned = updatedArticle.idArticleVersionned.toString();

   console.log(idArticleVersionned);
   ArticleVersionnedModel.findById(idArticleVersionned, (err, result) => {
      if (err) {
         console.log(err);
         res.status(500).json(err);
      } else {
         console.log(result);
         result.history.push(updatedArticle.id);
         result.save();
         updatedArticle.save();
         res.status(200).json('updated');
      }
   });
});
//
// /**
// * @api {DELETE} /api/events/:id Delete an event via his id
// * @apiName DeleteEvent
// * @apiGroup Events
// * @apiDescription Delete an event via his id
// *
// * @apiParam {ObjectId} id Event unique ID.
// */
// routes.delete('/:id', (req, res) => {
//    const eventId = req.params.id;
//
//    EventModel.findById(eventId)
//       .then(event => event.remove().then(() => {
//          logger.info(`Event ${eventId} removed`);
//          res.status(200).json({ success: true });
//       }))
//       .catch(err => {
//          logger.error(err);
//          res.status(500).send(err);
//       });
// });
//
// /**
// * @api {GET} /api/events/:city/currently-happening Get events currently happening
// * @apiName GetEventsCurrentlyHappening
// * @apiGroup Events
// * @apiDescription Get all events currently happening for a city
// *
// * @apiParam {String} city The name of the city to search events for.
// */
// routes.get('/:city/currently-happening', async (req, res) => {
//    const events = await EventModel.currentlyHappening(req.params.city);
//
//    if (events) res.status(200).json(events);
//    else res.status(404).send('No events happening now found');
// });
//
// /**
// * @api {GET} /api/events/:city/happening-at-date Get events happening at date
// * @apiName GetEventsHappeningAtDate
// * @apiGroup Events
// * @apiDescription Get all events happening at a given date
// *
// * @apiParam {String} city The name of the city to search events for.
// * @apiParam {Date}   date The date to search events for.
// */
// routes.get('/:city/happening-at-date/:date', async (req, res) => {
//    const { city, date } = req.params;
//
//    const events = await EventModel.happeningAtDate(city, date);
//
//    if (events) res.status(200).json(events);
//    else res.status(404).send('No events happening at this date found');
// });
//
// /**
// * @api {GET} /api/events/:city/fbeventsids Get fb events ids for a city
// * @apiName GetFbEventsIdsForCity
// * @apiGroup Events
// * @apiDescription Get all fb events ids for a city (used by the scraper script to know
//    if event has already been added)
// * @apiParam {String} city The name of the city to search events for.
// */
// routes.get('/:city/fbeventsids', async (req, res) => {
//    try {
//       const events = await EventModel.find({ city: new RegExp(req.params.city, 'i') });
//       return res.status(200).json(events.map(event => event.fbLink.split('events/')[1]));
//    } catch (error) {
//       logger.error(error);
//       return res.status(500).send(error);
//    }
// });
//
// /**
// * @api {GET} /api/events/:id/similar-events Get events similar to an event (via his id)
// * @apiName GetEventViaId
// * @apiGroup Events
// * @apiDescription Get events similar to an event (via his id) first via his music styles,
// *  then get events for current establishment, result length is limited to 5.
// * @apiParam {ObjectId} id Event unique ID.
// */
// routes.get('/:id/similar-events', async (req, res) => {
//    try {
//       const event = await EventModel.findById(req.params.id)
//          .populate('establishment', establishmentFieldsToPopulate);
//       // Bool to search events in the same establishment than the event passed in param
//       let searchForThisEstablishment = true;
//       const { musicStyles, establishment } = event;
//       let results = [];
//
//       if (musicStyles[0] !== 'Indéfini') {
//          const { query } = await getEvents({
//             query: { musicStyles }
//          });
//          if (query && query.length > 0) results = query;
//
//          // If enough events of the same style don't search for more events
//          if (results.length >= 6) searchForThisEstablishment = false;
//       }
//       if (establishment && establishment.name && searchForThisEstablishment) {
//          const { query } = await getEvents({
//             query: {
//                establishment: establishment.name
//             }
//          });
//
//          if (results.length === 0 && query && query.length > 0) results = query;
//          else if (query && query.length > 0) {
//             query.forEach((eventFound) => {
//                if (results.length < 6) results.push(eventFound);
//             });
//          }
//       }
//
//       results.sort(
//          (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
//       );
//
//       // 1. Limit the number of results to 5
//       if (results.length >= 6) results = results.slice(0, 6);
//       // 2. Generate an array with all ids
//       let eventsIds = [];
//       results.forEach(eventResult => eventsIds.push(eventResult._id.toString()));
//
//       // 3. Delete duplicates
//       eventsIds = eventsIds.filter((item, pos) => eventsIds.indexOf(item) === pos);
//       // 4. Delete id of the event in query
//       const index = eventsIds.indexOf(req.params.id.toString());
//       if (index > -1) {
//          eventsIds.splice(index, 1);
//       }
//       // 5. Get events via all ids
//       const finalResults = [];
//       for (let i = 0; i < eventsIds.length; i++) {
//          const eventId = eventsIds[i];
//          const eventFinalResult = await EventModel.findById(eventId)
//             .populate('establishment', establishmentFieldsToPopulate);
//          finalResults.push(eventFinalResult);
//       }
//       // 6. Return events
//       res.status(200).json(finalResults);
//    } catch (err) {
//       logger.error(err);
//       res.status(500).send(err);
//    }
// });
//
// /**
// * @api {GET} /api/events/:city/not-passed Get all events for a city that aren't passed yet
// * @apiName GetEventsNotPassedForCity
// * @apiGroup Events
// * @apiDescription Get all fb events ids for a city that are not passed yet
// * @apiParam {String} city The name of the city to search events for.
// */
// routes.get('/:city/not-passed', async (req, res) => {
//    try {
//       const events = await EventModel.find({
//          city: new RegExp(req.params.city, 'i'),
//          startTime: { $gte: moment().startOf('day').toDate() }
//       });
//
//       return res.status(200).json(events);
//    } catch (error) {
//       logger.error(error);
//       return res.status(500).send(error);
//    }
// });

module.exports = routes;
