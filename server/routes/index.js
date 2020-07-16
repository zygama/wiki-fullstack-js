const { Router } = require('express');

// Routes /api
const articles = require('./api/articles');
const categories = require('./api/categories');

const router = Router();

router.use('/articles', articles);
router.use('/categories', categories);

module.exports = router;
