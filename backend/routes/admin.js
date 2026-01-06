// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Content = require('../models/Content');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// ==================== ADMIN PRODUCT ROUTES ====================
router.get('/products', auth, adminAuth, async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/products/:id/visibility', auth, adminAuth, async (req, res) => {
  try {
    const { visible } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: visible },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/products/:id/stock', auth, adminAuth, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== ADMIN CONTENT ROUTES ====================
router.get('/content', auth, adminAuth, async (req, res) => {
  try {
    const content = await Content.find().sort({ displayOrder: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/content', auth, adminAuth, async (req, res) => {
  try {
    const content = new Content({
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/content/:id', auth, adminAuth, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },
      { new: true }
    );
    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/content/:id', auth, adminAuth, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content section deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/content/order', auth, adminAuth, async (req, res) => {
  try {
    const { sections } = req.body;
    const bulkOps = sections.map((section, index) => ({
      updateOne: {
        filter: { _id: section._id },
        update: { $set: { displayOrder: index } }
      }
    }));
    
    await Content.bulkWrite(bulkOps);
    res.json({ message: 'Content order updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== ADMIN ORDERS ====================
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ANALYTICS ====================
router.get('/analytics', auth, adminAuth, async (req, res) => {
  try {
    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthlyRevenue,
      topProducts
    ] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Product.find().sort({ sales: -1 }).limit(5)
    ]);
    
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthlyRevenue,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;