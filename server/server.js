const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

// ---------------------------------------------------------------------------------------------- //

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
   .then(() => console.info('MongoDB connected to the app...'))
   .catch(err => console.info(err));
app.set('mongoose', mongoose);

// Load routes
app.use('/api', routes);

// Launch server on ${port}
app.listen(port, () => {
   console.info(`App is listening on port: ${port}`);
});
