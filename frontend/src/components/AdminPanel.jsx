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

const AdminPanel = ({ onBackToStore, darkMode, setDarkMode }) => {
  const [adminTab, setAdminTab] = useState('dashboard');
  const [deliverers, setDeliverers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    monthlyRevenue: [],
    topProducts: []
  });

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

  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    deliverers: false,
    customers: false,
    analytics: false
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
  try {
    setLoading(prev => ({ ...prev, products: true, orders: true, deliverers: true, customers: true, analytics: true }));
    
    const [productsData, ordersData, deliverersData, analyticsData] = await Promise.all([
      apiService.getProducts(),
      apiService.getAllOrders(),  // Changed from getOrders
      apiService.getDeliverersForAdmin(),  // Changed from getDeliverers
      apiService.getAnalytics()
      // Removed getCustomers() and getPurchaseAnalytics() - they don't exist in api.js
    ]);

    setProducts(productsData);
    setOrders(ordersData);
    setDeliverers(deliverersData);
    setAnalytics(analyticsData);
    
    // Set mock data for customers and purchase analytics until backend is ready
    setCustomers([]);
    setPurchaseAnalytics({
      byCategory: [],
      byPriceRange: [],
      bySize: [],
      topCustomers: [],
      salesTrend: [],
      deliveryPerformance: []
    });

  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    showToast('Failed to load data. Please try again.', 'error');
  } finally {
    setLoading(prev => ({ ...prev, products: false, orders: false, deliverers: false, customers: false, analytics: false }));
  }
};

  const formatPrice = (price) => {
    return 'UGX ' + price.toLocaleString();
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

 const handleAddDeliverer = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    const delivererData = {
      name: newDeliverer.name,
      email: newDeliverer.email,
      phone: newDeliverer.phone,
      vehicle_type: newDeliverer.vehicleType,  // snake_case
      license_plate: newDeliverer.licensePlate, // snake_case
      area: newDeliverer.area,
      status: 'active',
      online: true
    };

    console.log('Sending deliverer data:', delivererData);
    const response = await apiService.createDeliverer(delivererData);
    
    // Update the deliverers list with the new deliverer
    setDeliverers([...deliverers, response]);
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
  } catch (error) {
    console.error('Error adding deliverer:', error);
    showToast(error.message || 'Failed to add deliverer', 'error');
  }
};

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
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

      const response = await apiService.createProduct(productData);
      if (response.success) {
        setProducts([...products, response.data]);
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
      } else {
        showToast(response.message || 'Failed to add product', 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Failed to add product', 'error');
    }
  };

  const updateDelivererStatus = async (delivererId, status) => {
    try {
      const response = await apiService.updateDelivererStatus(delivererId, status);
      if (response.success) {
        setDeliverers(deliverers.map(deliverer => 
          deliverer.id === delivererId ? { ...deliverer, status, online: status === 'active' } : deliverer
        ));
        showToast(`Deliverer ${status}`, 'success');
      }
    } catch (error) {
      console.error('Error updating deliverer status:', error);
      showToast('Failed to update deliverer status', 'error');
    }
  };

  const deleteDeliverer = async (delivererId) => {
    try {
      const response = await apiService.deleteDeliverer(delivererId);
      if (response.success) {
        setDeliverers(deliverers.filter(deliverer => deliverer.id !== delivererId));
        showToast('Deliverer removed', 'info');
      }
    } catch (error) {
      console.error('Error deleting deliverer:', error);
      showToast('Failed to remove deliverer', 'error');
    }
  };

  const toggleDelivererOnline = async (delivererId) => {
    try {
      const deliverer = deliverers.find(d => d.id === delivererId);
      const newStatus = deliverer.online ? 'offline' : 'active';
      await updateDelivererStatus(delivererId, newStatus);
    } catch (error) {
      console.error('Error toggling deliverer online status:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await apiService.deleteProduct(productId);
      if (response.success) {
        setProducts(products.filter(product => product.id !== productId));
        showToast('Product deleted', 'info');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  const toggleProductStatus = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      const productData = { ...product, inStock: !product.inStock };
      
      const response = await apiService.updateProduct(productId, productData);
      if (response.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, inStock: !p.inStock } : p
        ));
        showToast('Product status updated', 'success');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      showToast('Failed to update product status', 'error');
    }
  };

  const Toast = () => {
    if (!toast) return null;

    const bgColors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    return (
      <div className={`fixed top-4 right-4 ${bgColors[toast.type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}>
        <CheckCircle className="w-5 h-5" />
        {toast.message}
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
    </div>
  );

  const AdminDashboard = () => {
    if (loading.analytics || loading.products || loading.orders || loading.deliverers || loading.customers) {
      return <LoadingSpinner />;
    }

    return (
      <div className="space-y-6 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition dark:hover:shadow-gray-700"
            onClick={() => setAdminTab('analytics')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(analytics.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">↑ 12% from last month</p>
          </div>

          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition dark:hover:shadow-gray-700"
            onClick={() => setAdminTab('orders')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">↑ 8% from last month</p>
          </div>

          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition dark:hover:shadow-gray-700"
            onClick={() => setAdminTab('customers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalCustomers}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">↑ 15 new this month</p>
          </div>

          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition dark:hover:shadow-gray-700"
            onClick={() => setAdminTab('deliverers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deliverers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{deliverers.filter(d => d.online).length}</p>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full">
                <Truck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-2">{deliverers.length} total deliverers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
              <Truck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Active Deliverers
            </h3>
            <div className="space-y-4">
              {deliverers.filter(d => d.online).map((deliverer) => (
                <div 
                  key={deliverer.id} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedDeliverer(deliverer)}
                >
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">{deliverer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{deliverer.vehicleType} • {deliverer.currentLocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold dark:text-white">{deliverer.totalDeliveries} deliveries</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{deliverer.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
              <PackageCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
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
                    <span className="text-sm font-medium dark:text-white">{performance.deliverer}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold dark:text-white">{performance.onTime}/{performance.completed} on time</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round((performance.onTime / performance.completed) * 100)}% success rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div 
                  key={order.orderNumber} 
                  className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div>
                    <p className="font-semibold dark:text-white">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold dark:text-white">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
              <UsersIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Top Customers
            </h3>
            <div className="space-y-3">
              {customers.slice(0, 5).map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div>
                    <p className="font-semibold dark:text-white">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.totalOrders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold dark:text-white">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last order: {formatDate(customer.lastOrder)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeliverersManagement = () => {
    if (loading.deliverers) return <LoadingSpinner />;

    return (
      <div className="space-y-6 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">Deliverers Management</h2>
          <button
            onClick={() => setShowAddDeliverer(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Deliverer
          </button>
        </div>

        {showAddDeliverer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">Add New Deliverer</h3>
                <button type="button" onClick={() => setShowAddDeliverer(false)}>
                  <X className="w-5 h-5 dark:text-white" />
                </button>
              </div>
              <form onSubmit={handleAddDeliverer} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newDeliverer.name}
                  onChange={(e) => setNewDeliverer({...newDeliverer, name: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newDeliverer.email}
                  onChange={(e) => setNewDeliverer({...newDeliverer, email: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newDeliverer.phone}
                  onChange={(e) => setNewDeliverer({...newDeliverer, phone: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <select
                  value={newDeliverer.vehicleType}
                  onChange={(e) => setNewDeliverer({...newDeliverer, vehicleType: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
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
                  className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Service Area"
                  value={newDeliverer.area}
                  onChange={(e) => setNewDeliverer({...newDeliverer, area: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
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
                    className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverers.map((deliverer) => (
            <div key={deliverer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">{deliverer.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{deliverer.vehicleType}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${deliverer.online ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{deliverer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{deliverer.licensePlate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{deliverer.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{deliverer.totalDeliveries} deliveries</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold dark:text-white">{deliverer.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    deliverer.online ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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

  const CustomersManagement = () => {
    if (loading.customers) return <LoadingSpinner />;

    return (
      <div className="space-y-6 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">Customers Management</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {customers.length} customers total
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{customer.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Joined {formatDate(customer.joinDate)}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="truncate dark:text-gray-300">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-gray-300">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="truncate dark:text-gray-300">{customer.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{customer.totalOrders}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Last order:</span>
                  <span className="font-semibold dark:text-white">{formatDate(customer.lastOrder)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AnalyticsPage = () => {
    if (loading.analytics) return <LoadingSpinner />;

    return (
      <div className="space-y-6 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">Advanced Analytics</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Purchases by Price Range</h3>
            <div className="space-y-4">
              {purchaseAnalytics.byPriceRange.map((range, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="dark:text-gray-300">{range.range}</span>
                    <span className="dark:text-gray-300">{range.count} orders ({range.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Purchases by Size</h3>
            <div className="space-y-3">
              {purchaseAnalytics.bySize.map((size, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-300">{size.size}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(size.count / 120) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8 dark:text-white">{size.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold dark:text-white">Top Customers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Avg. Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {purchaseAnalytics.topCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{customer.totalOrders}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatPrice(customer.totalSpent / customer.totalOrders)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ProductsManagement = () => {
    if (loading.products) return <LoadingSpinner />;

    return (
      <div className="space-y-6 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">Products Management</h2>
          <div className="flex gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg dark:text-white">{product.name}</h3>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{formatPrice(product.price)}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{product.category} • {product.brand}</p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="dark:text-gray-300">{product.rating}</span>
                    <span className="text-gray-500 dark:text-gray-500">({product.reviews})</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.inStock ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'deliverers', label: 'Deliverers', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toast />
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Store</span>
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <h1 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={loadDashboardData}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
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
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 min-h-[600px]">
          <div className="p-6">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'analytics' && <AnalyticsPage />}
            {adminTab === 'deliverers' && <DeliverersManagement />}
            {adminTab === 'customers' && <CustomersManagement />}
            {adminTab === 'products' && <ProductsManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;