const mongoose = require('mongoose');
const validator = require('validator');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
    required: true,
  },
});

citySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'country',
    select: '-__v',
  });
  next();
});

const City = mongoose.model('City', citySchema);

module.exports = City;
