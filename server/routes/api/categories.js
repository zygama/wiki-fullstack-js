const { Router } = require('express');
const CategorieModel = require('../../models/categories');

const routes = Router();

/**
 * @api {GET} /api/events Get all categories
 * @apiName GetArticles
 * @apiGroup Articles
 * @apiDescription Get all articles
 */
routes.get('/', async (req, res) => {
   CategorieModel.find().then(categories => {
      res.status(200).json(categories);
   }).catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});

/**
 * @api {POST} /api/categories Create categorie
 * @apiName PostCategorie
 * @apiGroup Categories
 * @apiDescription create a category
 */
routes.post('/', async (req, res) => {
   try {
      const newCategorie = new CategorieModel({ ...req.body });
      await newCategorie.save();

      res.status(200).send('ok');
   } catch (error) {
      console.log(error);
      res.status(500).send(error);
   }
});

/**
 * @api {GET} /api/categories/:id Get a category by id
 * @apiName GetCategory
 * @apiGroup Category
 * @apiDescription Get a category by id
 *
 * @apiParam {ObjectId} id Category unique ID.
 */
routes.get('/:id', (req, res) => {
   // get the article from the id
   const categoryId = req.params.id;
   CategorieModel.findById(categoryId, (err, result) => {
      if (err) {
         console.log(err);
         res.status(500).json(err);
      } else {
         console.log(result);
         res.status(200).json(result);
      }
   });
});

routes.put('/:id', async (req, res) => {
   try {
      const { id } = req.params;
      await CategorieModel.updateOne({ _id: id }, { $set: { title: req.body.title } });
      res.status(200).json('update ok');
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

/**
* @api {DELETE} /api/categories/:id Delete a category by id
* @apiName DeleteCategory
* @apiGroup Categories
* @apiDescription Delete a category by idvia his id
*
* @apiParam {ObjectId} id Category unique ID.
*/
routes.delete('/:id', (req, res) => {
   const categoryId = req.params.id;

   CategorieModel.findById(categoryId)
      .then(event => event.remove().then(() => {
         res.status(200).json({ success: true });
      }))
      .catch(err => {
         console.log(err);
         res.status(500).send(err);
      });
});

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
