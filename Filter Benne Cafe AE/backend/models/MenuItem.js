const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '/assets/food_spread.png',
  },
  tag: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries: items within a category, sorted
menuItemSchema.index({ category: 1, sortOrder: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
