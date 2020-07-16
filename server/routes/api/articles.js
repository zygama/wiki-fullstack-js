const { Router } = require('express');
const ArticleModel = require('../../models/articles');


const routes = Router();


/**
 * @api {GET} /api/events Get all events
 * @apiName GetEvents
 * @apiGroup Events
 * @apiDescription Get all events
 */
routes.get('/', async (req, res) => {
   try {
      
      res.status(200).json(query);
   } catch (error) {
      console.error(error);
      res.status(500).send(error);
   }
});


/**
* @api {POST} /api/events Post an event
* @apiName PostEvent
* @apiGroup Events
* @apiDescription Post an event
*/
routes.post('/', async (req, res) => {
   try {
      const newEvent = new EventModel({ ...req.body });
      const savedEvent = await newEvent.save();

      res.status(201).json(savedEvent);
   } catch (error) {
      logger.error(error);
      res.status(500).send(error);
   }
});


/**
* @api {GET} /api/events/:id Get an event via his id
* @apiName GetEventViaId
* @apiGroup Events
* @apiDescription Get an event via his id
*
* @apiParam {ObjectId} id Event unique ID.
*/
routes.get('/:id', async (req, res) => {
   EventModel.findById(req.params.id)
      .populate('establishment', establishmentFieldsToPopulate)
      .then((event) => {
         res.status(200).json(event);
      })
      .catch(err => {
         logger.error(err);
         res.status(500).send(err);
      });
});


/**
* @api {PUT} /api/events/:id Update an event via his id
* @apiName UpdateEvent
* @apiGroup Events
* @apiDescription Update an event via his id
*
* @apiParam {ObjectId} id Event unique ID.
*/
routes.patch('/:id', (req, res) => {
   const eventId = req.params.id;
   const newData = req.body;

   // The new: true permits to return the updated data instead of old
   EventModel.findByIdAndUpdate(eventId, newData, { new: true }, (err, result) => {
      if (err) {
         logger.error(err);
         res.status(500).json(err);
      } else {
         logger.info(`Event ${eventId} patched with new data ${newData}`);
         res.status(200).json(result);
      }
   });
});


/**
* @api {DELETE} /api/events/:id Delete an event via his id
* @apiName DeleteEvent
* @apiGroup Events
* @apiDescription Delete an event via his id
*
* @apiParam {ObjectId} id Event unique ID.
*/
routes.delete('/:id', (req, res) => {
   const eventId = req.params.id;

   EventModel.findById(eventId)
      .then(event => event.remove().then(() => {
         logger.info(`Event ${eventId} removed`);
         res.status(200).json({ success: true });
      }))
      .catch(err => {
         logger.error(err);
         res.status(500).send(err);
      });
});


/**
* @api {GET} /api/events/:city/currently-happening Get events currently happening
* @apiName GetEventsCurrentlyHappening
* @apiGroup Events
* @apiDescription Get all events currently happening for a city
*
* @apiParam {String} city The name of the city to search events for.
*/
routes.get('/:city/currently-happening', async (req, res) => {
   const events = await EventModel.currentlyHappening(req.params.city);

   if (events) res.status(200).json(events);
   else res.status(404).send('No events happening now found');
});


/**
* @api {GET} /api/events/:city/happening-at-date Get events happening at date
* @apiName GetEventsHappeningAtDate
* @apiGroup Events
* @apiDescription Get all events happening at a given date
*
* @apiParam {String} city The name of the city to search events for.
* @apiParam {Date}   date The date to search events for.
*/
routes.get('/:city/happening-at-date/:date', async (req, res) => {
   const { city, date } = req.params;

   const events = await EventModel.happeningAtDate(city, date);

   if (events) res.status(200).json(events);
   else res.status(404).send('No events happening at this date found');
});


/**
* @api {GET} /api/events/:city/fbeventsids Get fb events ids for a city
* @apiName GetFbEventsIdsForCity
* @apiGroup Events
* @apiDescription Get all fb events ids for a city (used by the scraper script to know
   if event has already been added)
* @apiParam {String} city The name of the city to search events for.
*/
routes.get('/:city/fbeventsids', async (req, res) => {
   try {
      const events = await EventModel.find({ city: new RegExp(req.params.city, 'i') });
      return res.status(200).json(events.map(event => event.fbLink.split('events/')[1]));
   } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
   }
});


/**
* @api {GET} /api/events/:id/similar-events Get events similar to an event (via his id)
* @apiName GetEventViaId
* @apiGroup Events
* @apiDescription Get events similar to an event (via his id) first via his music styles,
*  then get events for current establishment, result length is limited to 5.
* @apiParam {ObjectId} id Event unique ID.
*/
routes.get('/:id/similar-events', async (req, res) => {
   try {
      const event = await EventModel.findById(req.params.id)
         .populate('establishment', establishmentFieldsToPopulate);
      // Bool to search events in the same establishment than the event passed in param
      let searchForThisEstablishment = true;
      const { musicStyles, establishment } = event;
      let results = [];

      if (musicStyles[0] !== 'Indéfini') {
         const { query } = await getEvents({
            query: { musicStyles }
         });
         if (query && query.length > 0) results = query;

         // If enough events of the same style don't search for more events
         if (results.length >= 6) searchForThisEstablishment = false;
      }
      if (establishment && establishment.name && searchForThisEstablishment) {
         const { query } = await getEvents({
            query: {
               establishment: establishment.name
            }
         });

         if (results.length === 0 && query && query.length > 0) results = query;
         else if (query && query.length > 0) {
            query.forEach((eventFound) => {
               if (results.length < 6) results.push(eventFound);
            });
         }
      }

      results.sort(
         (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
      );

      // 1. Limit the number of results to 5
      if (results.length >= 6) results = results.slice(0, 6);
      // 2. Generate an array with all ids
      let eventsIds = [];
      results.forEach(eventResult => eventsIds.push(eventResult._id.toString()));

      // 3. Delete duplicates
      eventsIds = eventsIds.filter((item, pos) => eventsIds.indexOf(item) === pos);
      // 4. Delete id of the event in query
      const index = eventsIds.indexOf(req.params.id.toString());
      if (index > -1) {
         eventsIds.splice(index, 1);
      }
      // 5. Get events via all ids
      const finalResults = [];
      for (let i = 0; i < eventsIds.length; i++) {
         const eventId = eventsIds[i];
         const eventFinalResult = await EventModel.findById(eventId)
            .populate('establishment', establishmentFieldsToPopulate);
         finalResults.push(eventFinalResult);
      }
      // 6. Return events
      res.status(200).json(finalResults);
   } catch (err) {
      logger.error(err);
      res.status(500).send(err);
   }
});


/**
* @api {GET} /api/events/:city/not-passed Get all events for a city that aren't passed yet
* @apiName GetEventsNotPassedForCity
* @apiGroup Events
* @apiDescription Get all fb events ids for a city that are not passed yet
* @apiParam {String} city The name of the city to search events for.
*/
routes.get('/:city/not-passed', async (req, res) => {
   try {
      const events = await EventModel.find({
         city: new RegExp(req.params.city, 'i'),
         startTime: { $gte: moment().startOf('day').toDate() }
      });

      return res.status(200).json(events);
   } catch (error) {
      logger.error(error);
      return res.status(500).send(error);
   }
});

module.exports = routes;
