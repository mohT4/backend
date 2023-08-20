const express = require('express');

const router = express.Router();
const moviesController = require('../controllers/moviesController');
const authController = require('../controllers/authController');

router.get('/', authController.protect, moviesController.getAllMovies);

module.exports = router;
