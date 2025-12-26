const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireSeller = require('../middleware/requireSeller');
const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// Create an auction (Seller Only)
router.post('/', auth, requireSeller, async (req, res) => {
  try {
    const { productId, startingPrice, endTime } = req.body;

    if (!productId || !startingPrice || !endTime) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const auction = await Auction.create({
      sellerId: req.user.id,
      productId,
      startingPrice,
      endTime
    });

    res.json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all active auctions (Public)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const auctions = await Auction.find({ endTime: { $gt: now } })
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get auction by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Place a bid (Logged-in users only)

router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Bid amount required' });
    }

    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (new Date() > auction.endTime) {
      return res.status(400).json({ error: 'Auction ended' });
    }

    if (amount <= auction.highestBid) {
      return res.status(400).json({ error: 'Bid too low' });
    }

    // ✅ Save bid history
    await Bid.create({
      auctionId: auction._id,
      userId: req.user.id,
      amount
    });

    // ✅ Update auction summary
    auction.highestBid = amount;
    auction.highestBidder = req.user.id;

    await auction.save();

    res.json({ message: 'Bid placed successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
