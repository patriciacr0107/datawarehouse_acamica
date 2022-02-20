const mongoose = require('mongoose');
const validator = require('validator');

const chanelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
});

const Chanel = mongoose.model('Chanel', chanelSchema);

module.exports = Chanel;
