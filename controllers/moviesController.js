const Movies = require('../models/moviesModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const featurs = new ApiFeatures(Movies.find(), req.query)
    .filter()
    .fields()
    .limit()
    .sort();
  const movies = await featurs.query;

  res.status(200).json({
    status: 'success',
    data: {
      moviesNumber: movies.length,
      movies: movies,
    },
  });
});
