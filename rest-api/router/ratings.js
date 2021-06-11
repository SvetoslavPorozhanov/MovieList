const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { ratingsController } = require('../controllers');

// middleware that is specific to this router

router.get('/:movieTitle', auth(), ratingsController.getRating);
router.post('/:movieTitle', auth(), ratingsController.createRating);
router.delete('/:movieTitle', auth(), ratingsController.deleteRating);

module.exports = router