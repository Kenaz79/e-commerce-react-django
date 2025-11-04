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
let promoCodes = [
  { code: 'SAVE10', discount: 0.10, type: 'percentage', active: true },
  { code: 'FLASH50', discount: 50000, type: 'fixed', active: true },
  { code: 'WELCOME20', discount: 0.20, type: 'percentage', active: true }
];

// Sample initial data
const initializeData = () => {
  products = [
    {
      id: 1,
      name: 'Samsung Galaxy S24 Ultra',
      price: 3299000,
      oldPrice: 3799000,
      category: 'phones',
      brand: 'Samsung',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 234,
      discount: 13,
      inStock: true,
      stock: 5,
      views: 1250,
      description: 'The Samsung Galaxy S24 Ultra features a stunning 6.8-inch display, powerful Snapdragon processor, and an incredible 200MP camera system.',
      specs: ['256GB Storage', '12GB RAM', '200MP Camera', '5000mAh Battery', '5G Enabled'],
      colors: ['Black', 'White', 'Purple'],
      sizes: ['Standard'],
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop'
      ],
      flashSale: true,
      flashSaleEnd: Date.now() + 3600000,
      bulkDiscount: { quantity: 2, discount: 0.05 },
      createdAt: new Date().toISOString()
    },
    // Add other sample products...
  ];

  categories = [
    { id: 'all', name: 'All Products', icon: 'Menu' },
    { id: 'electronics', name: 'Electronics', icon: 'Laptop' },
    { id: 'phones', name: 'Phones', icon: 'Smartphone' },
    { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
    { id: 'home', name: 'Home & Garden', icon: 'Home' },
  ];

  deliverers = [
    {
      id: 1,
      name: 'James Mugisha',
      email: 'james@deliveries.ug',
      phone: '+256-700-111-222',
      status: 'active',
      joinDate: '2024-01-15',
      totalDeliveries: 156,
      vehicleType: 'Motorcycle',
      licensePlate: 'UBA 123A',
      area: 'Kampala Central',
      rating: 4.8,
      currentLocation: 'Nakasero',
      online: true
    }
  ];
};

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

// Products Routes
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, minRating, sortBy } = req.query;
  
  let filteredProducts = [...products];

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  // Filter by search query
  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseInt(maxPrice));
  }

  // Filter by rating
  if (minRating) {
    filteredProducts = filteredProducts.filter(product => product.rating >= parseFloat(minRating));
  }

  // Sort products
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

app.post('/api/products', authenticateToken, isAdmin, (req, res) => {
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

app.put('/api/products/:id', authenticateToken, isAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
});

app.delete('/api/products/:id', authenticateToken, isAdmin, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Categories Routes
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Orders Routes
app.get('/api/orders', authenticateToken, (req, res) => {
  let userOrders = orders;

  // If not admin, only return user's orders
  if (req.user.role !== 'admin') {
    userOrders = orders.filter(order => order.userId === req.user.id);
  }

  res.json(userOrders);
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.orderNumber === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Check if user owns the order or is admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(order);
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

app.put('/api/orders/:id/status', authenticateToken, isAdmin, (req, res) => {
  const order = orders.find(o => o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = req.body.status;
  res.json(order);
});

// Cart Routes
app.get('/api/cart', authenticateToken, (req, res) => {
  // In a real app, you'd store carts in the database
  // For now, we'll return empty array - frontend handles cart state
  res.json([]);
});

// Reviews Routes
app.get('/api/products/:id/reviews', (req, res) => {
  const productReviews = reviews.filter(review => review.productId === parseInt(req.params.id));
  res.json(productReviews);
});

app.post('/api/products/:id/reviews', authenticateToken, (req, res) => {
  try {
    const review = {
      id: uuidv4(),
      productId: parseInt(req.params.id),
      userId: req.user.id,
      userName: req.user.name,
      ...req.body,
      date: new Date().toISOString()
    };

    reviews.push(review);

    // Update product rating
    const productReviews = reviews.filter(r => r.productId === parseInt(req.params.id));
    const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
      product.rating = averageRating;
      product.reviews = productReviews.length;
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Deliverers Routes
app.get('/api/deliverers', authenticateToken, isAdmin, (req, res) => {
  res.json(deliverers);
});

app.post('/api/deliverers', authenticateToken, isAdmin, (req, res) => {
  try {
    const deliverer = {
      id: deliverers.length + 1,
      ...req.body,
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
    res.status(500).json({ error: 'Failed to create deliverer' });
  }
});

app.put('/api/deliverers/:id/status', authenticateToken, isAdmin, (req, res) => {
  const deliverer = deliverers.find(d => d.id === parseInt(req.params.id));
  if (!deliverer) {
    return res.status(404).json({ error: 'Deliverer not found' });
  }

  deliverer.online = req.body.online;
  res.json(deliverer);
});

// Analytics Routes
app.get('/api/analytics/overview', authenticateToken, isAdmin, (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
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
      revenue: monthOrders.reduce((sum, order) => sum + order.total, 0)
    });
  }

  // Top products
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
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

// Promo Codes Routes
app.get('/api/promo-codes/:code', (req, res) => {
  const promoCode = promoCodes.find(
    promo => promo.code === req.params.code.toUpperCase() && promo.active
  );
  
  if (!promoCode) {
    return res.status(404).json({ error: 'Invalid promo code' });
  }

  res.json(promoCode);
});

// Addresses Routes
app.get('/api/addresses', authenticateToken, (req, res) => {
  const userAddresses = addresses.filter(addr => addr.userId === req.user.id);
  res.json(userAddresses);
});

app.post('/api/addresses', authenticateToken, (req, res) => {
  try {
    const address = {
      id: uuidv4(),
      userId: req.user.id,
      ...req.body
    };

    addresses.push(address);
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// Support Tickets Routes
app.get('/api/tickets', authenticateToken, (req, res) => {
  let userTickets = tickets;

  if (req.user.role !== 'admin') {
    userTickets = tickets.filter(ticket => ticket.userId === req.user.id);
  }

  res.json(userTickets);
});

app.post('/api/tickets', authenticateToken, (req, res) => {
  try {
    const ticket = {
      id: 'TIC' + Date.now(),
      userId: req.user.id,
      ...req.body,
      status: 'Open',
      date: new Date().toISOString()
    };

    tickets.push(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Initialize data
initializeData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});