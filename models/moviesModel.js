const mongoose = require('mongoose');

const moviesSchema = mongoose.Schema(
  {
    name: String,
    directors: String,
    year: Number,
  },
  { timestamps: true }
);

const Movies = mongoose.model('Movies', moviesSchema);

module.exports = Movies;
