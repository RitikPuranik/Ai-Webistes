const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  defaultImage: {
    type: String,
    default: '/assets/food_spread.png',
  },
}, {
  timestamps: true,
});

// Always sort by sortOrder by default
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
