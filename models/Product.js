const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    type: String // stored file path or URL
  },
  category: {
    type: String,
    enum: [
      'All Auction',
      'Standard Auction',
      'Sealed Auction',
      'Reverse Auction'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['unsold', 'sold'],
    default: 'unsold'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
