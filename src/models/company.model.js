const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    lowercase: true,
  },
  city: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
    required: true,
  },
});

companySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'city',
    select: '-__v',
  });
  next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
