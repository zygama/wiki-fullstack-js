/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const logger = require('../utils/logger');
const { establishmentFieldsToPopulate } = require('../utils');


const EventSchema = new Schema({
   name: { type: String, required: true },
   establishment: { type: ObjectId, ref: 'establishments' }, // Not required in case the event come from an organisation
   organisation: { type: ObjectId, ref: 'organisations' }, // Case the event come from an organisation
   description: { type: String },
   descriptionHTML: { type: String },
   musicStyles: [{ type: String, required: true }],
   fbLink: { type: String, required: true, unique: true },
   address: { type: String },
   // TODO: set as index: true because we use it a lot to get via city
   city: { type: String, required: true },
   location: { type: Object, required: true }, // { lat: "", lon: "" }
   startTime: { type: Date, required: true },
   endTime: { type: Date, required: true },
   image: { type: String }, // Image in base64 format
   // Used with events from organisations (can sometimes be empty if not referenced)
   locationName: { type: String },
   ticketLink: { type: String },
   // Hash of the object (used to compare the actual object with a potential new one updated)
   hash: { type: String, required: true },
   // Is set to true when music styles are setted manually
   isMusicStylesSetManually: { type: Boolean, required: true, default: false }
}, {
   timestamps: true
});

EventSchema.plugin(uniqueValidator);

// Validate dates (start time before end time)
EventSchema.pre('save', function (next) {
   if (moment(this.endTime).isBefore(this.startTime)) {
      const errString = `There is an error the end time (${this.endTime}) is before the start time (${this.startTime})`;
      const err = new Error(errString);
      logger.error(errString);
      next(err);
   } else {
      next();
   }
});

EventSchema.statics.currentlyHappening = async (p_city) => {
   // Events in database are stored in UTC+0, in France we are in UTC+2 (or + 1 in winter) so we format
   const nowUtc = moment().utcOffset(0).toDate();
   // const nowUtc = moment().utcOffset(0);

   const events = await Events.find({
      city: p_city,
      startTime: {
         $lte: nowUtc
      },
      endTime: {
         $gte: nowUtc
      }
   }).populate('establishment', establishmentFieldsToPopulate);

   return events;
};

EventSchema.statics.happeningAtDate = async (p_city, p_date, p_fromBot) => {
   // If request came from bot
   const dateToSearch = p_fromBot ? moment(p_date, 'DD/MM/YYYY').startOf('day') : moment(p_date, 'YYYY-MM-DD').startOf('day');

   const events = await Events.find({
      city: p_city,
      startTime: {
         $gte: dateToSearch.toDate(),
         $lte: moment(dateToSearch).endOf('day').toDate()
      }
   }).populate('establishment', establishmentFieldsToPopulate);

   return events;
};

EventSchema.statics.searchByStyle = async (p_city, p_style) => {
   const events = await Events.find({
      city: p_city,
      musicStyles: p_style
   }, null, { sort: 'startTime' }).populate('establishment', establishmentFieldsToPopulate);

   return events;
};

const Events = mongoose.model('events', EventSchema);

module.exports = Events;
