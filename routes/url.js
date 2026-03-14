//*ROUTES

const express = require("express");
const router = express.Router();
const {generateNewShortUrl} = require('../controllers/url')
const {handleGetAnalytics} = require('../controllers/url')

router.post('/',generateNewShortUrl);

router.get('/analytics/:shortId',handleGetAnalytics)

module.exports = router;