const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Mock deliverers data (replace with actual database model)
let deliverers = [];

// Get all deliverers (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    res.json(deliverers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create deliverer (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, phone, vehicle_type, license_plate, area, status, online } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !vehicle_type || !license_plate) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'vehicle_type', 'license_plate']
      });
    }
    
    const newDeliverer = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      vehicleType: vehicle_type,
      licensePlate: license_plate,
      area: area || 'Not specified',
      status: status || 'active',
      online: online !== undefined ? online : true,
      totalDeliveries: 0,
      rating: 5.0,
      currentLocation: area || 'Unknown',
      createdAt: new Date()
    };
    
    deliverers.push(newDeliverer);
    res.status(201).json(newDeliverer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update deliverer status
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { online } = req.body;
    const deliverer = deliverers.find(d => d.id === req.params.id);
    
    if (!deliverer) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }
    
    deliverer.online = online;
    deliverer.status = online ? 'active' : 'offline';
    
    res.json(deliverer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete deliverer
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    deliverers = deliverers.filter(d => d.id !== req.params.id);
    res.json({ message: 'Deliverer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;