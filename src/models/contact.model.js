const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  names: {
    type: String,
    required: [true, 'Names is required'],
    trim: true,
    lowercase: true,
  },
  surnames: {
    type: String,
    required: [true, 'Surenames is required'],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    trim: true,
    lowercase: true,
  },
  interest: {
    type: Number,
    trim: true,
    lowercase: true,
  },
  chanels: [
    /* {
      account: {
        type: Number,
        required: [true, 'Account is required'],
        trim: true,
        lowercase: true,
      },
    },
    {
      preferences: {
        type: Number,
        required: [true, 'Preferences is required'],
        trim: true,
        lowercase: true,
      },
    },
    {
      chanel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Region',
        required: true,
      },
    }, */
  ],
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
  },
  city: {
    type: mongoose.Schema.ObjectId,
    ref: 'City',
  },
});

contactSchema.pre(/^find/, function (next) {

  /*const { region } = this._conditions
  console.log('region ', region);*/

  this.populate({
    path: 'city company',
    select: '-__v',
  });
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
