const mongoose = require('mongoose');

const collabSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  image_id: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  portfolio: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  }
}, { timestamps: true });

const Collab = mongoose.model('collab', collabSchema);
module.exports = Collab;
