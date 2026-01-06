// backend/models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  content: String,
  type: {
    type: String,
    enum: ['hero', 'promotion', 'featured', 'testimonial', 'announcement'],
    default: 'promotion'
  },
  imageUrl: String,
  backgroundColor: String,
  textColor: {
    type: String,
    default: '#000000'
  },
  buttonText: String,
  buttonUrl: String,
  buttonColor: {
    type: String,
    default: '#3b82f6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'returning', 'mobile', 'desktop'],
    default: 'all'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);