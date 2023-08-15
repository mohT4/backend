const mongoose = require('mongoose');

const moviesSchema = mongoose.Schema({
  name: String,
  directors: String,
  year: Number,
});

const Movies = mongoose.model('Movies', moviesSchema);

module.exports = Movies;
