import { useState, useEffect } from 'react';
import { 
  BarChart3, Settings, Users, Package, DollarSign, 
  ShoppingBag, Shield, CheckCircle, AlertTriangle, 
  Trash2, Star, ArrowLeft, MessageSquare, Sun, Moon,
  X, Filter, Plus, Edit, Download, Upload, PieChart,
  Activity, Calendar, TrendingUp, Eye, ShoppingCart,
  Tag, User, MapPin, Clock, ArrowRight,
  ChevronRight, Search, TrendingDown, Heart, Users as UsersIcon,
  CreditCard, Truck, CheckCircle as CheckCircleIcon,
  Image, FileText, Layers, Grid, Navigation, Car,
  Home, Phone, Mail, Map, PackageCheck, Clock as ClockIcon,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';

const AdminPanel = ({ onBackToStore, products: initialProducts, orders: initialOrders, darkMode, setDarkMode }) => {
  const [adminTab, setAdminTab] = useState('dashboard');
  const [deliverers, setDeliverers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState(initialProducts || []);
  const [orders, setOrders] = useState(initialOrders || []);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    monthlyRevenue: [],
    topProducts: []
  });

  // New state for enhanced analytics
  const [purchaseAnalytics, setPurchaseAnalytics] = useState({
    byCategory: [],
    byPriceRange: [],
    bySize: [],
    topCustomers: [],
    salesTrend: [],
    deliveryPerformance: []
  });

  const [showAddDeliverer, setShowAddDeliverer] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDeliverer, setSelectedDeliverer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newDeliverer, setNewDeliverer] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
    area: ''
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    description: '',
    stock: '',
    image: ''
  });

  // Enhanced sample data initialization
  useEffect(() => {
    const sampleDeliverers = [
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
      },
      {
        id: 2,
        name: 'Sarah Nalwoga',
        email: 'sarah@deliveries.ug',
        phone: '+256-700-333-444',
        status: 'active',
        joinDate: '2024-02-20',
        totalDeliveries: 89,
        vehicleType: 'Car',
        licensePlate: 'UBK 456B',
        area: 'Kira Road',
        rating: 4.6,
        currentLocation: 'Bukoto',
        online: true
      },
      {
        id: 3,
        name: 'David Ochieng',
        email: 'david@deliveries.ug',
        phone: '+256-700-555-666',
        status: 'offline',
        joinDate: '2024-03-10',
        totalDeliveries: 45,
        vehicleType: 'Motorcycle',
        licensePlate: 'UAE 789C',
        area: 'Entebbe Road',
        rating: 4.2,
        currentLocation: 'Kajjansi',
        online: false
      }
    ];

    const sampleCustomers = [
      {
        id: 1,
        name: 'John Kamya',
        email: 'john@example.com',
        phone: '+256-701-123-456',
        joinDate: '2024-01-10',
        totalOrders: 8,
        totalSpent: 4500000,
        lastOrder: '2024-06-15',
        address: 'Plot 123, Kololo, Kampala',
        favoriteCategory: 'electronics'
      },
      {
        id: 2,
        name: 'Sarah Nakato',
        email: 'sarah@example.com',
        phone: '+256-702-234-567',
        joinDate: '2024-02-15',
        totalOrders: 6,
        totalSpent: 3800000,
        lastOrder: '2024-06-12',
        address: 'Block 45, Ntinda, Kampala',
        favoriteCategory: 'fashion'
      },
      {
        id: 3,
        name: 'Mike Ssebaggala',
        email: 'mike@example.com',
        phone: '+256-703-345-678',
        joinDate: '2024-03-20',
        totalOrders: 5,
        totalSpent: 3200000,
        lastOrder: '2024-06-10',
        address: 'House 67, Buziga, Kampala',
        favoriteCategory: 'phones'
      }
    ];

    // Enhanced analytics data
    const categories = ['phones', 'electronics', 'fashion', 'home'];
    const samplePurchaseAnalytics = {
      byCategory: categories.map(category => ({
        category,
        count: Math.floor(Math.random() * 50) + 20,
        revenue: Math.floor(Math.random() * 20000000) + 5000000
      })),
      byPriceRange: [
        { range: 'Under 100K', count: 45, percentage: 32 },
        { range: '100K - 500K', count: 38, percentage: 27 },
        { range: '500K - 1M', count: 28, percentage: 20 },
        { range: '1M - 3M', count: 18, percentage: 13 },
        { range: 'Over 3M', count: 11, percentage: 8 }
      ],
      bySize: [
        { size: 'S', count: 25 },
        { size: 'M', count: 45 },
        { size: 'L', count: 32 },
        { size: 'XL', count: 18 },
        { size: 'Standard', count: 120 }
      ],
      topCustomers: sampleCustomers,
      salesTrend: [
        { day: 'Mon', sales: 12, revenue: 4500000 },
        { day: 'Tue', sales: 18, revenue: 6800000 },
        { day: 'Wed', sales: 15, revenue: 5200000 },
        { day: 'Thu', sales: 22, revenue: 8500000 },
        { day: 'Fri', sales: 25, revenue: 9200000 },
        { day: 'Sat', sales: 30, revenue: 11500000 },
        { day: 'Sun', sales: 20, revenue: 7800000 }
      ],
      deliveryPerformance: [
        { deliverer: 'James Mugisha', completed: 156, onTime: 142, rating: 4.8 },
        { deliverer: 'Sarah Nalwoga', completed: 89, onTime: 82, rating: 4.6 },
        { deliverer: 'David Ochieng', completed: 45, onTime: 38, rating: 4.2 }
      ]
    };

    const sampleAnalytics = {
      totalRevenue: 85000000,
      totalOrders: orders.length || 342,
      totalProducts: products.length,
      totalCustomers: sampleCustomers.length,
      monthlyRevenue: [
        { month: 'Jan', revenue: 12000000 },
        { month: 'Feb', revenue: 18000000 },
        { month: 'Mar', revenue: 22000000 },
        { month: 'Apr', revenue: 19000000 },
        { month: 'May', revenue: 25000000 },
        { month: 'Jun', revenue: 28000000 }
      ],
      topProducts: products.slice(0, 5).map(p => ({
        ...p,
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: (Math.floor(Math.random() * 100) + 20) * p.price
      }))
    };

    setDeliverers(sampleDeliverers);
    setCustomers(sampleCustomers);
    setAnalytics(sampleAnalytics);
    setPurchaseAnalytics(samplePurchaseAnalytics);
  }, [products, orders]);

  const formatPrice = (price) => {
    return 'UGX ' + price.toLocaleString();
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  const showToast = (message, type = 'success') => {
    // You can implement a toast notification system here
    console.log(`${type}: ${message}`);
  };

  const handleAddDeliverer = (e) => {
    e.preventDefault();
    const deliverer = {
      id: deliverers.length + 1,
      ...newDeliverer,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      totalDeliveries: 0,
      rating: 0,
      currentLocation: 'Not assigned',
      online: false
    };
    setDeliverers([...deliverers, deliverer]);
    setShowAddDeliverer(false);
    setNewDeliverer({
      name: '',
      email: '',
      phone: '',
      vehicleType: '',
      licensePlate: '',
      area: ''
    });
    showToast('Deliverer added successfully', 'success');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      rating: 4.0,
      reviews: 0,
      inStock: true,
      oldPrice: null,
      discount: 0,
      views: 0,
      specs: [],
      colors: [],
      sizes: ['Standard'],
      images: [newProduct.image],
      flashSale: false,
      bulkDiscount: null
    };
    setProducts([...products, product]);
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      brand: '',
      description: '',
      stock: '',
      image: ''
    });
    showToast('Product added successfully', 'success');
  };

  const updateDelivererStatus = (delivererId, status) => {
    setDeliverers(deliverers.map(deliverer => 
      deliverer.id === delivererId ? { ...deliverer, status, online: status === 'active' } : deliverer
    ));
    showToast(`Deliverer ${status}`, 'success');
  };

  const deleteDeliverer = (delivererId) => {
    setDeliverers(deliverers.filter(deliverer => deliverer.id !== delivererId));
    showToast('Deliverer removed', 'info');
  };

  const toggleDelivererOnline = (delivererId) => {
    setDeliverers(deliverers.map(deliverer => 
      deliverer.id === delivererId ? { ...deliverer, online: !deliverer.online } : deliverer
    ));
    showToast('Deliverer status updated', 'success');
  };

  // Enhanced Admin Dashboard Component
  const AdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => setAdminTab('analytics')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(analytics.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => setAdminTab('orders')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-2">↑ 8% from last month</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => setAdminTab('customers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-2">↑ 15 new this month</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => setAdminTab('deliverers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deliverers</p>
                <p className="text-2xl font-bold text-gray-900">{deliverers.filter(d => d.online).length}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-full">
                <Truck className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <p className="text-sm text-cyan-600 mt-2">{deliverers.length} total deliverers</p>
          </div>
        </div>

        {/* Delivery Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Deliverers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-600" />
              Active Deliverers
            </h3>
            <div className="space-y-4">
              {deliverers.filter(d => d.online).map((deliverer) => (
                <div 
                  key={deliverer.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedDeliverer(deliverer)}
                >
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{deliverer.name}</p>
                    <p className="text-xs text-gray-500">{deliverer.vehicleType} • {deliverer.currentLocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{deliverer.totalDeliveries} deliveries</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">{deliverer.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-green-600" />
              Delivery Performance
            </h3>
            <div className="space-y-4">
              {purchaseAnalytics.deliveryPerformance.map((performance, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm font-medium">{performance.deliverer}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{performance.onTime}/{performance.completed} on time</p>
                    <p className="text-xs text-gray-500">{Math.round((performance.onTime / performance.completed) * 100)}% success rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders & Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div 
                  key={order.orderNumber} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div>
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-purple-600" />
              Top Customers
            </h3>
            <div className="space-y-3">
              {customers.slice(0, 5).map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.totalOrders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-500">Last order: {formatDate(customer.lastOrder)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Deliverers Management Component
  const DeliverersManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Deliverers Management</h2>
          <button
            onClick={() => setShowAddDeliverer(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Deliverer
          </button>
        </div>

        {/* Add Deliverer Modal */}
        {showAddDeliverer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Deliverer</h3>
                <button onClick={() => setShowAddDeliverer(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddDeliverer} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newDeliverer.name}
                  onChange={(e) => setNewDeliverer({...newDeliverer, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newDeliverer.email}
                  onChange={(e) => setNewDeliverer({...newDeliverer, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newDeliverer.phone}
                  onChange={(e) => setNewDeliverer({...newDeliverer, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <select
                  value={newDeliverer.vehicleType}
                  onChange={(e) => setNewDeliverer({...newDeliverer, vehicleType: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Car">Car</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Van">Van</option>
                </select>
                <input
                  type="text"
                  placeholder="License Plate"
                  value={newDeliverer.licensePlate}
                  onChange={(e) => setNewDeliverer({...newDeliverer, licensePlate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Service Area"
                  value={newDeliverer.area}
                  onChange={(e) => setNewDeliverer({...newDeliverer, area: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600"
                  >
                    Add Deliverer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDeliverer(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Deliverers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverers.map((deliverer) => (
            <div key={deliverer.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{deliverer.name}</h3>
                      <p className="text-sm text-gray-500">{deliverer.vehicleType}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${deliverer.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{deliverer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 text-gray-500" />
                    <span>{deliverer.licensePlate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{deliverer.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>{deliverer.totalDeliveries} deliveries</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{deliverer.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    deliverer.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {deliverer.online ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDelivererOnline(deliverer.id)}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                      deliverer.online 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {deliverer.online ? 'Take Offline' : 'Bring Online'}
                  </button>
                  <button
                    onClick={() => deleteDeliverer(deliverer.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Customers Management Component
  const CustomersManagement = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Customers Management</h2>
          <div className="text-sm text-gray-500">
            {customers.length} customers total
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-gray-500">Joined {formatDate(customer.joinDate)}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-cyan-600">{customer.totalOrders}</p>
                    <p className="text-xs text-gray-500">Total Orders</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last order:</span>
                  <span className="font-semibold">{formatDate(customer.lastOrder)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Deliverer Details Modal
  const DelivererDetailsModal = () => {
    if (!selectedDeliverer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Deliverer Details</h2>
              <button onClick={() => setSelectedDeliverer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedDeliverer.name}</h3>
                    <p className="text-gray-600">{selectedDeliverer.vehicleType} Driver</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedDeliverer.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDeliverer.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{selectedDeliverer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{selectedDeliverer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-semibold">{selectedDeliverer.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License Plate:</span>
                    <span className="font-semibold">{selectedDeliverer.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Area:</span>
                    <span className="font-semibold">{selectedDeliverer.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Location:</span>
                    <span className="font-semibold">{selectedDeliverer.currentLocation}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Performance Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-600">{selectedDeliverer.totalDeliveries}</p>
                      <p className="text-sm text-gray-500">Total Deliveries</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <p className="text-2xl font-bold">{selectedDeliverer.rating}</p>
                      </div>
                      <p className="text-sm text-gray-500">Rating</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <p className="text-sm text-gray-600">
                    Joined on {formatDate(selectedDeliverer.joinDate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Currently {selectedDeliverer.online ? 'available for deliveries' : 'offline'}
                  </p>
                </div>

                <button
                  onClick={() => toggleDelivererOnline(selectedDeliverer.id)}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    selectedDeliverer.online 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {selectedDeliverer.online ? 'Take Offline' : 'Bring Online'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Customer Details Modal
  const CustomerDetailsModal = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <p className="text-gray-600">Loyal Customer</p>
                    <p className="text-sm text-gray-500">Member since {formatDate(selectedCustomer.joinDate)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorite Category:</span>
                    <span className="font-semibold capitalize">{selectedCustomer.favoriteCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Order:</span>
                    <span className="font-semibold">{formatDate(selectedCustomer.lastOrder)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Purchase Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-600">{selectedCustomer.totalOrders}</p>
                      <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{formatPrice(selectedCustomer.totalSpent)}</p>
                      <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-lg font-semibold">
                      {formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                    </p>
                    <p className="text-sm text-gray-500">Average Order Value</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Customer Status</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedCustomer.totalOrders > 5 ? 'bg-green-500' : 
                      selectedCustomer.totalOrders > 2 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="font-semibold">
                      {selectedCustomer.totalOrders > 5 ? 'VIP Customer' : 
                       selectedCustomer.totalOrders > 2 ? 'Regular Customer' : 'New Customer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Page Component
  const AnalyticsPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase by Price Range */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Purchases by Price Range</h3>
            <div className="space-y-4">
              {purchaseAnalytics.byPriceRange.map((range, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{range.range}</span>
                    <span>{range.count} orders ({range.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchases by Size */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Purchases by Size</h3>
            <div className="space-y-3">
              {purchaseAnalytics.bySize.map((size, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{size.size}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(size.count / 120) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8">{size.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Top Customers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchaseAnalytics.topCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.totalOrders}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(customer.totalSpent / customer.totalOrders)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Products Management Component
  const ProductsManagement = () => {
    const deleteProduct = (productId) => {
      setProducts(products.filter(product => product.id !== productId));
      showToast('Product deleted', 'info');
    };

    const toggleProductStatus = (productId) => {
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, inStock: !product.inStock }
          : product
      ));
      showToast('Product status updated', 'success');
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products Management</h2>
          <div className="flex gap-3">
            <div className="text-sm text-gray-500">
              {products.length} products total
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="text-cyan-600 font-bold">{formatPrice(product.price)}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{product.category} • {product.brand}</p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-500">({product.reviews})</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleProductStatus(product.id)}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                      product.inStock 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {product.inStock ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add Product Modal
  const AddProductModal = () => {
    if (!showAddProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (UGX)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Category</option>
                    <option value="phones">Phones</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Garden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter stock quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter product description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Order Details Modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details - #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-cyan-600 font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold">{formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total Amount:</span>
                    <span className="text-cyan-600">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {selectedOrder.shippingAddress && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.shippingAddress.fullName}<br />
                      {selectedOrder.shippingAddress.address}<br />
                      {selectedOrder.shippingAddress.city}<br />
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Product Details Modal
  const ProductDetailsModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-80 object-cover rounded-lg" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Product Details</h3>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold capitalize">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="font-semibold">{selectedProduct.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-cyan-600">{formatPrice(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="font-semibold">{selectedProduct.stock} units</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedProduct.rating}</span>
                  <span className="text-gray-500">({selectedProduct.reviews} reviews)</span>
                </div>

                {selectedProduct.sales && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      {selectedProduct.sales} units sold • {formatPrice(selectedProduct.revenue)} revenue
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the navigation to include new tabs
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'deliverers', label: 'Deliverers', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="flex items-center gap-2 text-gray-600 hover:text-cyan-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Store</span>
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-600" />
                <h1 className="text-2xl font-bold text-cyan-600">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Admin Navigation */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin Content */}
        <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
          <div className="p-6">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'analytics' && <AnalyticsPage />}
            {adminTab === 'deliverers' && <DeliverersManagement />}
            {adminTab === 'customers' && <CustomersManagement />}
            {adminTab === 'products' && <ProductsManagement />}
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderDetailsModal />
      <ProductDetailsModal />
      <DelivererDetailsModal />
      <CustomerDetailsModal />
      <AddProductModal />
    </div>
  );
};

export default AdminPanel;