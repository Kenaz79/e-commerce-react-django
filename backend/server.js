// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
let users = [];
let products = [];
let orders = [];
let categories = [];
let deliverers = [];
let reviews = [];
let addresses = [];
let tickets = [];
let promoCodes = [];

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const deliverersRoutes = require('./routes/deliverers');
app.use('/api/admin/deliverers', deliverersRoutes);

    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products Routes (Public)
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, minRating, sortBy } = req.query;
  
  let filteredProducts = [...products];

  // Apply filters
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseInt(maxPrice));
  }

  if (minRating) {
    filteredProducts = filteredProducts.filter(product => product.rating >= parseFloat(minRating));
  }

  // Sort
  if (sortBy) {
    switch (sortBy) {
      case 'priceLow':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
  }

  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Increment views
  product.views += 1;

  res.json(product);
});

// Admin Products Routes
app.get('/api/admin/products', authenticateToken, isAdmin, (req, res) => {
  res.json(products);
});

app.post('/api/admin/products', authenticateToken, isAdmin, (req, res) => {
  try {
    const product = {
      id: products.length + 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      views: 0,
      reviews: 0
    };

    products.push(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/admin/products/:id', authenticateToken, isAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
});

app.delete('/api/admin/products/:id', authenticateToken, isAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Deliverers Routes
app.get('/api/deliverers', authenticateToken, isAdmin, (req, res) => {
  res.json(deliverers);
});

// CRITICAL: Add the endpoint your frontend is calling
app.post('/api/admin/deliverers', authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, email, phone, vehicle_type, license_plate, area } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !vehicle_type || !license_plate || !area) {
      return res.status(400).json({ 
        error: 'All fields are required: name, email, phone, vehicle_type, license_plate, area' 
      });
    }

    // Check if deliverer already exists
    const existingDeliverer = deliverers.find(d => d.email === email);
    if (existingDeliverer) {
      return res.status(400).json({ error: 'Deliverer with this email already exists' });
    }

    const deliverer = {
      id: deliverers.length + 1,
      name,
      email,
      phone,
      vehicle_type,
      license_plate,
      area,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      totalDeliveries: 0,
      rating: 0,
      currentLocation: 'Not assigned',
      online: false
    };

    deliverers.push(deliverer);
    res.status(201).json(deliverer);
  } catch (error) {
    console.error('Error creating deliverer:', error);
    res.status(500).json({ error: 'Failed to create deliverer' });
  }
});

app.put('/api/admin/deliverers/:id/status', authenticateToken, isAdmin, (req, res) => {
  const deliverer = deliverers.find(d => d.id === parseInt(req.params.id));
  if (!deliverer) {
    return res.status(404).json({ error: 'Deliverer not found' });
  }

  deliverer.online = req.body.online;
  res.json(deliverer);
});

app.delete('/api/admin/deliverers/:id', authenticateToken, isAdmin, (req, res) => {
  const delivererIndex = deliverers.findIndex(d => d.id === parseInt(req.params.id));
  if (delivererIndex === -1) {
    return res.status(404).json({ error: 'Deliverer not found' });
  }

  deliverers.splice(delivererIndex, 1);
  res.json({ message: 'Deliverer deleted successfully' });
});

// Analytics Routes
app.get('/api/admin/analytics', authenticateToken, isAdmin, (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = users.filter(user => user.role === 'customer').length;

  // Monthly revenue calculation
  const monthlyRevenue = [];
  const currentYear = new Date().getFullYear();
  
  for (let month = 0; month < 6; month++) {
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === month;
    });
    
    monthlyRevenue.push({
      month: new Date(currentYear, month).toLocaleString('default', { month: 'short' }),
      revenue: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    });
  }

  // Top products
  const productSales = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { ...item, sales: 0, revenue: 0 };
      }
      productSales[item.id].sales += item.quantity;
      productSales[item.id].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  res.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    monthlyRevenue,
    topProducts
  });
});

// Customers Routes
app.get('/api/admin/customers', authenticateToken, isAdmin, (req, res) => {
  const customers = users.filter(user => user.role === 'customer');
  res.json(customers);
});

// Orders Routes
app.get('/api/admin/orders', authenticateToken, isAdmin, (req, res) => {
  res.json(orders);
});

app.get('/api/orders', authenticateToken, (req, res) => {
  let userOrders = orders;
  if (req.user.role !== 'admin') {
    userOrders = orders.filter(order => order.userId === req.user.id);
  }
  res.json(userOrders);
});

app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const order = {
      orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: req.user.id,
      ...req.body,
      date: new Date().toISOString(),
      status: 'Processing',
      tracking: 'TRK' + Date.now()
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Purchase Analytics Route (for your frontend)
app.get('/api/admin/analytics/purchases', authenticateToken, isAdmin, (req, res) => {
  const analytics = {
    byCategory: [],
    byPriceRange: [
      { range: 'UGX 0-100K', count: 45, percentage: 35 },
      { range: 'UGX 100K-500K', count: 60, percentage: 46 },
      { range: 'UGX 500K-1M', count: 15, percentage: 12 },
      { range: 'UGX 1M+', count: 10, percentage: 7 }
    ],
    bySize: [
      { size: 'S', count: 35 },
      { size: 'M', count: 50 },
      { size: 'L', count: 25 },
      { size: 'XL', count: 10 }
    ],
    topCustomers: users.filter(u => u.role === 'customer').slice(0, 5).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      totalOrders: Math.floor(Math.random() * 20) + 1,
      totalSpent: Math.floor(Math.random() * 5000000) + 1000000
    })),
    salesTrend: [
      { month: 'Jan', sales: 45 },
      { month: 'Feb', sales: 52 },
      { month: 'Mar', sales: 48 },
      { month: 'Apr', sales: 61 },
      { month: 'May', sales: 55 },
      { month: 'Jun', sales: 72 }
    ],
    deliveryPerformance: [
      { deliverer: 'James Mugisha', completed: 156, onTime: 142 },
      { deliverer: 'Sarah Kim', completed: 89, onTime: 78 },
      { deliverer: 'David Ochieng', completed: 112, onTime: 98 }
    ]
  };
  
  res.json(analytics);
});

// Initialize with one admin user for testing
const initData = () => {
  // Create default admin user
  bcrypt.hash('admin123', 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error creating admin user:', err);
      return;
    }
    
    users.push({
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    console.log('Admin user created: admin@example.com / admin123');
  });
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initData();
});