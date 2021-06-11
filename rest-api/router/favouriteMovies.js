const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { favouriteMovieController } = require('../controllers');

// middleware that is specific to this router

router.get('/:movieTitle', auth(), favouriteMovieController.getMovie);
router.post('/:movieTitle', auth(), favouriteMovieController.createMovie);
router.delete('/:movieTitle', auth(), favouriteMovieController.deleteMovie);

module.exports = router