const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireSeller = require('../middleware/requireSeller');
const upload = require('../middleware/upload');
const Product = require('../models/Product');

// CREATE PRODUCT (Seller Only + Image Upload)
router.post(
  '/',
  auth,
  requireSeller,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description, category } = req.body;

      if (!title || !category) {
        return res.status(400).json({ error: 'Title and category are required' });
      }

      const product = await Product.create({
        sellerId: req.user.id,
        title,
        description,
        category,
        image: req.file ? `/uploads/${req.file.filename}` : null
      });

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PUBLIC - LIST PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC - SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
