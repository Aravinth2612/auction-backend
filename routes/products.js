const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireSeller = require('../middleware/requireSeller');
const Product = require('../models/Product');

// Create Product (Seller Only)
router.post('/', auth, requireSeller, async (req, res) => {
  try {
    const { title, description, image, category } = req.body;

    const product = await Product.create({
      sellerId: req.user.id,
      title,
      description,
      image,
      category
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public - List all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Public - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
