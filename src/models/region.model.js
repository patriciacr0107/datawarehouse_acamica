const mongoose = require('mongoose');
const validator = require('validator');

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
