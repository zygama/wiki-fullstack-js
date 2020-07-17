const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

// ---------------------------------------------------------------------------------------------- //

// const port = process.env.PORT; // Port to launch server on
const port = 3000; // Port to launch server on
const mongoUrl = 'mongodb://localhost:27017/wiki';

// Mongoose deprecation warning fixes
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Connect express to mongoose
mongoose.connect(mongoUrl, { useNewUrlParser: true })
   .then(() => {
      console.info('MongoDB connected to the app...');
      const app = express();
      app.set('mongoose', mongoose);
      app.use(cors());
      //app.use(express.urlencoded({ extended: false }));
      app.use(express.json({ type: 'application/json' }));
      app.use('/api', routes);
      app.listen(port, () => {
         console.info(`App is listening on port: ${port}`);
      });
   })
   .catch(err => console.info(err));
