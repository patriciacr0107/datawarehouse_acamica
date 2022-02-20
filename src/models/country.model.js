const mongoose = require('mongoose');
const validator = require('validator');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  region: {
    type: mongoose.Schema.ObjectId,
    ref: 'Region',
    required: true,
  },
});

countrySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'region',
    select: '-__v',
  });
  next();
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
