const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true
  },
  pdf: {
    type: String,
    required: [true, 'PDF URL is required']
  },
  pdf_id: {
    type: String,
    required: [true, 'PDF URL is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
