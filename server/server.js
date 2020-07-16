// If not in production load env variables from '.env' file
// Need to set NODE_ENV variable -> export NODE_ENV=development
// eslint-disable-next-line global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { CronJob } = require('cron');

const logger = require('./src/utils/logger');
const routes = require('./src/routes');
const scraper = require('./src/scraper/scraper');

// ---------------------------------------------------------------------------------------------- //

const isCronJobRunning = false;
const port = process.env.PORT; // Port to launch server on

const app = express();

// Enable CORS from all Origins: DANGEROUS -> TODO: enable only front admin and app
app.use(cors());

// Make Express use BodyParser with limit of 10mb (usefull when getting huge base64 images)
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Mongoose deprecation warning fixes
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Connect express to mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
   .then(() => logger.info('MongoDB connected to the app...'))
   .catch(err => logger.error(err));
app.set('mongoose', mongoose);

// Load routes
app.use('/api', routes);

// Launch server on ${port}
app.listen(port, () => {
   logger.info(`App is listening on port: ${port}`);
});

// Heroku stay awake (sleep mode if no request in less than 30 minutes)
// setInterval(() => {
//    axios.get('https://watts-out-bot.herokuapp.com/api/cities');
// }, 300000); // Every 5 minutes

// // Scrape every day at 20:30 (try)
// const scraperCronJob = new CronJob('0 7 * * *', async () => {
// // const scraperCronJob = new CronJob('30 * * * * *', async () => {
//    if (!isCronJobRunning) {
//       isCronJobRunning = true;
//       logger.info('Run scraping script');
//       await scraper.run('heroku);
//       logger.info('Scraping terminated');
//       isCronJobRunning = false;
//    } else {
//       // console.info('Cron job is running can\'t execute scraping script');
//    }
// });

// scraperCronJob.start();
