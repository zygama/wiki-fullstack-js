const { Router } = require('express');

// Routes /api
const establishments = require('./api/establishments');
const organisations = require('./api/organisations');
const events = require('./api/events');
const cities = require('./api/cities');
const musicStyles = require('./api/music-styles');
const users = require('./api/users');

const router = Router();

router.use('/establishments', establishments);
router.use('/organisations', organisations);
router.use('/events', events);
router.use('/cities', cities);
router.use('/music-styles', musicStyles);
router.use('/users', users);

module.exports = router;
