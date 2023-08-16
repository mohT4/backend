const { query, json } = require('express');
const Movies = require('../models/moviesModel');
const catchAsync = require('../utils/catchAsync');
const APIFeaturs = require('../utils/apiFeatures');
const appiFeatures = require('../utils/apiFeatures');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const featurs = new appiFeatures(req.query, Movies.find())
    .filter()
    .fields()
    .limit().sort;

  const movies = await featurs.query;
  res.status(200).json({
    status: 'success',
    data: {
      moviesNumber: movies.length,
      movies: movies,
    },
  });
});
