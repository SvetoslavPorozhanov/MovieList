const router = require('express').Router();
const users = require('./users');
const favouriteMovies = require('./favouriteMovies');
const ratings = require('./ratings');
const notes = require('./notes');

router.use('/users', users);
router.use('/favourites', favouriteMovies);
router.use('/ratings', ratings);
router.use('/notes', notes);

module.exports = router;
