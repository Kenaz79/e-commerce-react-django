// backend/routes/content.js (Public routes for buyers)
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Content = require('../models/Content');

// Get featured products (shown on buyer app)
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hero content (main banner/slider)
router.get('/hero', async (req, res) => {
  try {
    const content = await Content.find({ 
      type: 'hero', 
      isActive: true 
    }).sort({ displayOrder: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get promotional content
router.get('/promotional', async (req, res) => {
  try {
    const content = await Content.find({ 
      type: 'promotion', 
      isActive: true 
    }).sort({ displayOrder: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flash sales
router.get('/flash-sales', async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      flashSale: true,
      flashSaleEnd: { $gt: now },
      isActive: true
    }).sort({ flashSaleEnd: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;