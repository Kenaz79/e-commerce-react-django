import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, Heart, User, Star, TrendingUp, Smartphone, Laptop, Home, Shirt, X, ArrowLeft, Plus, Minus, Package, CreditCard, MapPin, Phone, Mail, Filter, SortAsc, Eye, Clock, Gift, Percent, MessageCircle, Bell, Sun, Moon, ChevronRight, Share2, Truck, Download, Zap, Users, Tag, Check, Shield } from 'lucide-react';
import AdminPanel from './AdminPanel';
import { apiService } from '../services/api';

function App() {
  const [cart, setCart] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [minRating, setMinRating] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [newsletter, setNewsletter] = useState('');
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [currency, setCurrency] = useState('UGX');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [productReviews, setProductReviews] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [accountTab, setAccountTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [returnForm, setReturnForm] = useState({ orderNumber: null, reason: '' });
  const initialProducts = [
  
];
  
  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    giftWrap: false,
    saveAddress: false
  });

  const promoCodes = {
    'SAVE10': { discount: 0.10, type: 'percentage' },
    'FLASH50': { discount: 50000, type: 'fixed' },
    'WELCOME20': { discount: 0.20, type: 'percentage' }
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: Menu },
    { id: 'electronics', name: 'Electronics', icon: Laptop },
    { id: 'phones', name: 'Phones', icon: Smartphone },
    { id: 'fashion', name: 'Fashion', icon: Shirt },
    { id: 'home', name: 'Home & Garden', icon: Home },
  ];

  const [products, setProducts] = useState([
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
      bulkDiscount: { quantity: 2, discount: 0.05 }
    },
    {
      id: 2,
      name: 'Apple iPhone 15 Pro Max',
      price: 4500000,
      oldPrice: 5000000,
      category: 'phones',
      brand: 'Apple',
      image: 'https://images.unsplash.com/photo-1695048064537-18e076d1c7b5?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 567,
      discount: 10,
      inStock: true,
      stock: 12,
      views: 2340,
      description: 'Experience the power of A17 Pro chip with the iPhone 15 Pro Max. Featuring titanium design and advanced camera system.',
      specs: ['512GB Storage', 'A17 Pro Chip', 'Pro Camera System', 'Titanium Design', 'USB-C'],
      colors: ['Titanium', 'Blue', 'White', 'Black'],
      sizes: ['Standard'],
      images: [
        'https://images.unsplash.com/photo-1695048064537-18e076d1c7b5?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1695048064537-18e076d1c7b5?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1695048064537-18e076d1c7b5?w=800&h=800&fit=crop'
      ],
      flashSale: false,
      bulkDiscount: { quantity: 3, discount: 0.08 }
    },
    {
      id: 3,
      name: 'Dell XPS 15 Laptop',
      price: 2800000,
      oldPrice: 3200000,
      category: 'electronics',
      brand: 'Dell',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 189,
      discount: 13,
      inStock: true,
      stock: 8,
      views: 890,
      description: 'Premium laptop with stunning InfinityEdge display and powerful Intel processor.',
      specs: ['Intel Core i7', '16GB RAM', '512GB SSD', '15.6" 4K Display', 'NVIDIA Graphics'],
      colors: ['Silver', 'Black'],
      sizes: ['15.6"'],
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop'
      ],
      flashSale: true,
      flashSaleEnd: Date.now() + 7200000,
      bulkDiscount: null
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5 Headphones',
      price: 850000,
      oldPrice: 1000000,
      category: 'electronics',
      brand: 'Sony',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 423,
      discount: 15,
      inStock: true,
      stock: 15,
      views: 1560,
      description: 'Industry-leading noise cancellation with exceptional sound quality and 30-hour battery life.',
      specs: ['Active Noise Cancellation', '30-Hour Battery', 'Premium Sound', 'Multipoint Connection', 'Touch Controls'],
      colors: ['Black', 'Silver'],
      sizes: ['One Size'],
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop'
      ],
      flashSale: false,
      bulkDiscount: { quantity: 2, discount: 0.10 }
    },
    {
      id: 5,
      name: 'Men\'s Casual Shirt',
      price: 45000,
      oldPrice: 65000,
      category: 'fashion',
      brand: 'StyleHub',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      rating: 4.2,
      reviews: 89,
      discount: 31,
      inStock: true,
      stock: 25,
      views: 450,
      description: 'Comfortable and stylish casual shirt perfect for everyday wear.',
      specs: ['100% Cotton', 'Regular Fit', 'Machine Washable', 'Multiple Colors', 'Sizes S-XXL'],
      colors: ['Blue', 'White', 'Black', 'Red'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop'
      ],
      flashSale: false,
      bulkDiscount: { quantity: 3, discount: 0.15 }
    },
    {
      id: 6,
      name: 'Women\'s Summer Dress',
      price: 55000,
      oldPrice: 80000,
      category: 'fashion',
      brand: 'FashionPro',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
      rating: 4.4,
      reviews: 156,
      discount: 31,
      inStock: true,
      stock: 18,
      views: 680,
      description: 'Elegant summer dress with beautiful floral pattern.',
      specs: ['Lightweight Fabric', 'Floral Pattern', 'Comfortable Fit', 'Easy Care', 'Sizes XS-XL'],
      colors: ['Floral Blue', 'Floral Pink', 'Floral Yellow'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop'
      ],
      flashSale: true,
      flashSaleEnd: Date.now() + 5400000,
      bulkDiscount: null
    },
    {
      id: 7,
      name: 'Smart LED TV 55"',
      price: 1200000,
      oldPrice: 1500000,
      category: 'electronics',
      brand: 'TechVision',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 267,
      discount: 20,
      inStock: true,
      stock: 6,
      views: 1120,
      description: 'Experience stunning 4K visuals with this 55-inch Smart LED TV.',
      specs: ['4K Ultra HD', 'Smart TV', 'HDR Support', 'Built-in WiFi', 'Multiple HDMI Ports'],
      colors: ['Black'],
      sizes: ['55"'],
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop'
      ],
      flashSale: false,
      bulkDiscount: null
    },
    {
      id: 8,
      name: 'Modern Sofa Set',
      price: 1800000,
      oldPrice: 2300000,
      category: 'home',
      brand: 'ComfortHome',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      rating: 4.3,
      reviews: 78,
      discount: 22,
      inStock: true,
      stock: 3,
      views: 340,
      description: 'Luxurious 3-seater sofa set with premium upholstery.',
      specs: ['3-Seater', 'Premium Fabric', 'Solid Wood Frame', 'Easy Assembly', 'Multiple Colors'],
      colors: ['Grey', 'Beige', 'Navy'],
      sizes: ['Standard'],
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop'
      ],
      flashSale: false,
      bulkDiscount: null
    },
  ]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Use apiService for all API calls
        const [productsData, ordersData] = await Promise.all([
          apiService.getProducts().catch(() => products),
          apiService.getOrders().catch(() => []),
        ]);

        setProducts(productsData);
        setOrders(ordersData);

        // Check authentication status
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (showAdminPanel) {
  return (
    <AdminPanel
      onBackToStore={() => setShowAdminPanel(false)}
      products={products}
      orders={orders}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );
}
        if (token && userData) {
          setUser(JSON.parse(userData));
          apiService.setToken(token);
        }

      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Fallback to local products
        setProducts(initialProducts);
      }
    };

    loadInitialData();
  }, []);

  // Sync cart to backend whenever it changes (fire-and-forget)
  useEffect(() => {
    const sync = async () => {
      if (!cart || cart.length === 0) return;
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart })
        });
      } catch (err) {
        // non-fatal; keep local cart
        console.warn('Cart sync failed', err);
      }
    };

    // avoid syncing empty initial state on mount
    if (cart) sync();
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, selectedColor = null, selectedSize = null) => {
    const existing = cart.find(item => 
      item.id === product.id && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );
    
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showToast(`Updated quantity for ${product.name}`, 'success');
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedColor, selectedSize }]);
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  const removeFromCart = (productId, selectedColor, selectedSize) => {
    setCart(cart.filter(item => 
      !(item.id === productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize)
    ));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, selectedColor, selectedSize, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to wishlist!', 'success');
    }
  };

  const toggleCompare = (product) => {
    if (compareProducts.find(p => p.id === product.id)) {
      setCompareProducts(compareProducts.filter(p => p.id !== product.id));
      showToast('Removed from comparison', 'info');
    } else {
      if (compareProducts.length < 3) {
        setCompareProducts([...compareProducts, product]);
        showToast('Added to comparison', 'success');
      } else {
        showToast('Maximum 3 products for comparison', 'warning');
      }
    }
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    
    if (!recentlyViewed.find(p => p.id === product.id)) {
      setRecentlyViewed([product, ...recentlyViewed].slice(0, 5));
    }
  };

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo(promo);
      showToast(`Promo code applied! ${promo.type === 'percentage' ? (promo.discount * 100) + '%' : 'UGX ' + promo.discount} off`, 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  const formatPrice = (price) => {
    const rates = { UGX: 1, USD: 0.00027, EUR: 0.00025, GBP: 0.00021 };
    const symbols = { UGX: 'UGX ', USD: '$', EUR: '€', GBP: '£' };
    const convertedPrice = price * rates[currency];
    return symbols[currency] + convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'UGX' ? 0 : 2,
      maximumFractionDigits: currency === 'UGX' ? 0 : 2
    });
  };

  const submitReview = (productId, rating, comment) => {
    if (!user) {
      showToast('Please login to leave a review', 'warning');
      setShowAuthModal(true);
      return;
    }
    const newReview = {
      id: Date.now(),
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString()
    };
    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), newReview]
    }));
    showToast('Review submitted!', 'success');
  };

  const requestReturn = (orderNumber, reason) => {
    setOrders(prev => prev.map(o =>
      o.orderNumber === orderNumber
        ? { ...o, returnRequest: { reason, status: 'Pending', date: new Date().toISOString() } }
        : o
    ));
    setReturnForm({ orderNumber: null, reason: '' });
    showToast('Return request submitted', 'success');
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  const getTrackingSteps = (order) => {
    const steps = ['Processing', 'Shipped', 'Out for delivery', 'Delivered'];
    const icons = [Package, Truck, Truck, Check];
    const currentIndex = Math.max(0, steps.indexOf(order.status));
    return steps.map((label, idx) => ({ label, icon: icons[idx], done: idx <= currentIndex }));
  };

  const calculateTotal = () => {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        subtotal = subtotal * (1 - appliedPromo.discount);
      } else {
        subtotal = subtotal - appliedPromo.discount;
      }
    }
    
    const tax = subtotal * 0.18;
    const giftWrapFee = checkoutData.giftWrap ? 5000 * cart.length : 0;
    
    return {
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      discount: appliedPromo ? (appliedPromo.type === 'percentage' ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * appliedPromo.discount : appliedPromo.discount) : 0,
      tax,
      giftWrapFee,
      total: subtotal + tax + giftWrapFee
    };
  };

  const cartTotal = calculateTotal().total;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getFilteredProducts = () => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });

    switch(sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const FlashSaleTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(endTime - Date.now());
      }, 1000);
      return () => clearInterval(timer);
    }, [endTime]);

    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return (
      <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
        <Zap className="w-4 h-4" />
        <span>{hours}h {minutes}m {seconds}s</span>
      </div>
    );
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
        <Check className="w-5 h-5" />
        {toast.message}
      </div>
    );
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const QuickViewModal = () => {
    if (!quickViewProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setQuickViewProduct(null)}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
              <button onClick={() => setQuickViewProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-96 object-cover rounded-lg" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(quickViewProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-gray-600">({quickViewProduct.reviews})</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-orange-600">{formatPrice(quickViewProduct.price)}</span>
                  {quickViewProduct.oldPrice && (
                    <span className="ml-3 text-xl text-gray-500 line-through">{formatPrice(quickViewProduct.oldPrice)}</span>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{quickViewProduct.description}</p>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      viewProductDetails(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="px-6 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50 py-3 rounded-lg font-bold transition"
                  >
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ComparisonModal = () => {
    if (compareProducts.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product Comparison</h2>
              <button onClick={() => setCompareProducts([])} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareProducts.map(product => (
                <div key={product.id} className="border rounded-lg p-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                  <h3 className="font-bold mb-2">{product.name}</h3>
                  <p className="text-cyan-600 font-bold text-xl mb-2">{formatPrice(product.price)}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold">{product.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviews:</span>
                      <span className="font-semibold">{product.reviews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-semibold">{product.stock} left</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold">{product.brand}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AuthModal = () => {
    if (!showAuthModal) return null;

    const handleAuth = (e) => {
      e.preventDefault();
      setUser({ name: 'John Doe', email: 'john@example.com' });
      setShowAuthModal(false);
      showToast(authMode === 'login' ? 'Logged in successfully!' : 'Account created!', 'success');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{authMode === 'login' ? 'Login' : 'Create Account'}</h2>
            <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold">
              {authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-cyan-500 font-semibold hover:underline"
            >
              {authMode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  };

  const LiveChat = () => {
    if (!showLiveChat) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-80 h-96 flex flex-col`}>
          <div className="bg-cyan-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Customer Support</h3>
            <button onClick={() => setShowLiveChat(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm">Hello! How can I help you today?</p>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NewsletterPopup = () => {
    if (!showNewsletter) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
          <button onClick={() => setShowNewsletter(false)} className="float-right">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-4">Get 10% off your first order and stay updated with latest deals!</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={newsletter}
              onChange={(e) => setNewsletter(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => {
                showToast('Subscribed successfully! Check your email for 10% off code', 'success');
                setShowNewsletter(false);
              }}
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 font-bold"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FiltersSidebar = () => {
    if (!showFilters) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setShowFilters(false)}>
        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-80 h-full overflow-y-auto p-6`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4"
                    />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm">& up</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button
              onClick={() => {
                setPriceRange([0, 5000000]);
                setMinRating(0);
                setSortBy('featured');
                showToast('Filters cleared', 'info');
              }}
              className="w-full border-2 border-cyan-500 text-cyan-500 py-2 rounded-lg hover:bg-cyan-50 font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CartSidebar = () => {
    if (!showCart) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setShowCart(false)}>
        <div
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full max-w-md h-full overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-4 border-b pb-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        {item.selectedColor && <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>}
                        {item.selectedSize && <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>}
                        <p className="text-orange-600 font-bold">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)}
                            className="p-1 border rounded hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)}
                            className="p-1 border rounded hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(calculateTotal().subtotal)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-semibold">-{formatPrice(calculateTotal().discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span className="font-semibold">{formatPrice(calculateTotal().tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-cyan-600">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCart(false);
                    setCurrentView('checkout');
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition"
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'checkout') {
    const totals = calculateTotal();

    const completeOrder = (e) => {
      e.preventDefault();
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      const newOrder = {
        orderNumber,
        date: new Date().toISOString(),
        items: cart,
        total: totals.total,
        status: 'Processing',
        tracking: 'TRK' + Date.now(),
        paymentMethod: checkoutData.paymentMethod,
        shippingAddress: {
          fullName: checkoutData.fullName,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address,
          city: checkoutData.city,
          postalCode: checkoutData.postalCode
        }
      };
      setOrders([...orders, newOrder]);
      if (checkoutData.saveAddress) {
        const addr = {
          id: 'ADDR' + Date.now(),
          fullName: checkoutData.fullName,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address,
          city: checkoutData.city,
          postalCode: checkoutData.postalCode
        };
        setAddresses(prev => {
          const exists = prev.some(a => a.address === addr.address && a.phone === addr.phone);
          return exists ? prev : [...prev, addr];
        });
      }
      setCart([]);
      setCurrentView('success');
      showToast('Order placed successfully!', 'success');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <Toast />
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2 hover:text-cyan-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Shopping</span>
              </button>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-cyan-600" />
                <h1 className="text-2xl font-bold text-cyan-600">Checkout</h1>
              </div>
              <div className="w-32"></div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={completeOrder} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                {addresses.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Saved Addresses</h2>
                    <div className="space-y-2">
                      {addresses.map(addr => (
                        <label key={addr.id} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selectedAddressId === addr.id}
                            onChange={() => {
                              setSelectedAddressId(addr.id);
                              setCheckoutData({
                                ...checkoutData,
                                fullName: addr.fullName,
                                email: addr.email,
                                phone: addr.phone,
                                address: addr.address,
                                city: addr.city,
                                postalCode: addr.postalCode
                              });
                            }}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="text-sm">
                            <div className="font-semibold">{addr.fullName} • {addr.phone}</div>
                            <div className="text-gray-600">{addr.address}, {addr.city}</div>
                            {addr.postalCode && <div className="text-gray-500">{addr.postalCode}</div>}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutData.fullName}
                      onChange={(e) => setCheckoutData({...checkoutData, fullName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          required
                          value={checkoutData.email}
                          onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          required
                          value={checkoutData.phone}
                          onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Address *</label>
                    <textarea
                      required
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={checkoutData.postalCode}
                        onChange={(e) => setCheckoutData({...checkoutData, postalCode: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutData.saveAddress}
                      onChange={(e) => setCheckoutData({...checkoutData, saveAddress: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Save address for future orders</span>
                  </label>
                </div>

                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={checkoutData.paymentMethod === 'card'}
                      onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="mobile"
                      checked={checkoutData.paymentMethod === 'mobile'}
                      onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                      className="w-4 h-4"
                    />
                    <Phone className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold">Mobile Money</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={checkoutData.paymentMethod === 'cod'}
                      onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                      className="w-4 h-4"
                    />
                    <Package className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold">Cash on Delivery</span>
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    checked={checkoutData.giftWrap}
                    onChange={(e) => setCheckoutData({...checkoutData, giftWrap: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Gift className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm">Add gift wrapping (UGX 5,000 per item)</span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-lg font-bold text-lg transition"
                >
                  Place Order
                </button>
              </form>
            </div>

            <div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-4`}>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-cyan-600 font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-green-600 text-sm mt-2">✓ Promo code applied!</p>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-semibold">-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span className="font-semibold">{formatPrice(totals.tax)}</span>
                  </div>
                  {checkoutData.giftWrap && (
                    <div className="flex justify-between">
                      <span>Gift Wrapping:</span>
                      <span className="font-semibold">{formatPrice(totals.giftWrapFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-cyan-600">{formatPrice(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'success') {
    const lastOrder = orders[orders.length - 1];
    
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md w-full text-center`}>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase</p>
          
          {lastOrder && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Total:</span>
                <span className="text-sm font-bold text-orange-600">{formatPrice(lastOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Tracking:</span>
                <span className="text-sm">{lastOrder.tracking}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                setAccountTab('orders');
                setCurrentView('account');
              }}
              className="flex-1 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50 py-3 rounded-lg font-bold transition"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ProductView = () => {
    if (!selectedProduct) return null;
    const [selectedColor, setSelectedColor] = useState(selectedProduct.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes?.[0] || null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const reviewsForProduct = productReviews[selectedProduct.id] || [];

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <Toast />
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 hover:text-cyan-600">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-cyan-600">Product Details</h1>
            <div className="w-16" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover rounded-lg cursor-zoom-in"
              onClick={() => setZoomedImage(selectedProduct.image)}
            />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {selectedProduct.images?.map((img, idx) => (
                <img key={idx} src={img} alt={selectedProduct.name}
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-90"
                  onClick={() => setZoomedImage(img)} />
              ))}
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-gray-600">({selectedProduct.reviews} reviews)</span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-cyan-600">{formatPrice(selectedProduct.price)}</span>
              {selectedProduct.oldPrice && (
                <span className="ml-3 text-xl text-gray-500 line-through">{formatPrice(selectedProduct.oldPrice)}</span>
              )}
            </div>
            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

            {selectedProduct.colors?.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold mb-2">Color</div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.colors.map((c) => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded border ${selectedColor === c ? 'bg-cyan-500 text-white border-cyan-500' : 'hover:bg-gray-50'}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.sizes?.length > 0 && (
              <div className="mb-4">
                <div className="font-semibold mb-2">Size</div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 rounded border ${selectedSize === s ? 'bg-cyan-500 text-white border-cyan-500' : 'hover:bg-gray-50'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-6">
              <button onClick={() => addToCart(selectedProduct, selectedColor, selectedSize)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold">Add to Cart</button>
              <button onClick={() => toggleWishlist(selectedProduct.id)}
                className="px-4 py-3 border rounded-lg hover:bg-gray-50">{wishlist.includes(selectedProduct.id) ? 'Wishlisted' : 'Wishlist'}</button>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">Specifications</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {selectedProduct.specs?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className="text-2xl font-bold mb-4">Reviews</h3>
            {reviewsForProduct.length === 0 ? (
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4 mb-6">
                {reviewsForProduct.map(r => (
                  <div key={r.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-sm text-gray-600">by {r.userName} • {formatDate(r.date)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Leave a Review</h4>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(v => (
                    <button key={v} onClick={() => setRating(v)}>
                      <Star className={`w-5 h-5 ${v <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={() => {
                    if (!comment.trim()) { showToast('Please enter a comment', 'warning'); return; }
                    submitReview(selectedProduct.id, rating, comment.trim());
                    setComment('');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AccountView = () => {
    if (!user) {
      return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} flex items-center justify-center p-4`}>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md w-full text-center`}>
            <h2 className="text-2xl font-bold mb-2">Sign in to view your account</h2>
            <p className="text-gray-600 mb-4">Access orders, addresses, profile and support</p>
            <div className="flex gap-3">
              <button onClick={() => setShowAuthModal(true)} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold">Login</button>
              <button onClick={() => { setAuthMode('register'); setShowAuthModal(true); }} className="flex-1 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50 py-3 rounded-lg font-bold">Register</button>
            </div>
            <button onClick={() => setCurrentView('home')} className="mt-4 text-sm text-gray-500 hover:text-cyan-600">Continue shopping</button>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <Toast />
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 hover:text-orange-600">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Shopping</span>
            </button>
            <h1 className="text-2xl font-bold text-cyan-600">Account Dashboard</h1>
            <div className="w-16" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-2 overflow-x-auto mb-6">
            {['orders','profile','addresses','support'].map(tab => (
              <button key={tab} onClick={() => setAccountTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize ${accountTab === tab ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-gray-800' : 'bg-white') + ' border hover:bg-gray-50'}`}
              >{tab}</button>
            ))}
          </div>

          {accountTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow text-center text-gray-600`}>
                  No orders yet.
                </div>
              ) : (
                orders.slice().reverse().map(order => (
                  <div key={order.orderNumber} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-bold">Order #{order.orderNumber}</div>
                        <div className="text-sm text-gray-600">{formatDate(order.date)}</div>
                      </div>
                      <div className="text-sm">
                        <span className="mr-4">Total: <span className="font-bold text-orange-600">{formatPrice(order.total)}</span></span>
                        <span>Status: <span className="font-semibold">{order.status}</span></span>
                      </div>
                      <button onClick={() => setExpandedOrder(expandedOrder === order.orderNumber ? null : order.orderNumber)} className="px-3 py-2 border rounded-lg hover:bg-gray-50 font-semibold">
                        {expandedOrder === order.orderNumber ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    {expandedOrder === order.orderNumber && (
                      <div className="mt-4 border-t pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold mb-2">Items</h4>
                            <div className="space-y-2">
                              {order.items.map((it, i) => (
                                <div key={i} className="flex gap-3 items-center">
                                  <img src={it.image} alt={it.name} className="w-14 h-14 object-cover rounded" />
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{it.name}</div>
                                    <div className="text-xs text-gray-600">Qty: {it.quantity} • {formatPrice(it.price * it.quantity)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2">Shipping</h4>
                            <div className="text-sm text-gray-700">
                              <div>{order.shippingAddress?.fullName} • {order.shippingAddress?.phone}</div>
                              <div>{order.shippingAddress?.address}, {order.shippingAddress?.city}</div>
                              {order.shippingAddress?.postalCode && <div>{order.shippingAddress?.postalCode}</div>}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold mb-2">Tracking</h4>
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {getTrackingSteps(order).map((step, idx) => {
                              const Icon = step.icon;
                              return (
                                <div key={idx} className="flex items-center gap-2">
                                  <Icon className={`w-5 h-5 ${step.done ? 'text-green-600' : 'text-gray-400'}`} />
                                  <span className={`${step.done ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>{step.label}</span>
                                  {idx < 3 && <span className="hidden md:inline text-gray-400 mx-2">›</span>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Tracking ID: {order.tracking}</div>
                        </div>

                        <div>
                          <h4 className="font-bold mb-2">Returns</h4>
                          {order.returnRequest ? (
                            <div className="text-sm text-gray-700">
                              Request: <span className="font-semibold">{order.returnRequest.reason}</span> • Status: <span className="font-semibold">{order.returnRequest.status}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {returnForm.orderNumber === order.orderNumber ? (
                                <>
                                  <input
                                    type="text"
                                    value={returnForm.reason}
                                    onChange={(e) => setReturnForm({ orderNumber: order.orderNumber, reason: e.target.value })}
                                    placeholder="Reason for return"
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                  />
                                  <button onClick={() => returnForm.reason.trim() && requestReturn(order.orderNumber, returnForm.reason.trim())}
                                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">Submit</button>
                                  <button onClick={() => setReturnForm({ orderNumber: null, reason: '' })}
                                    className="px-3 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                </>
                              ) : (
                                <button onClick={() => setReturnForm({ orderNumber: order.orderNumber, reason: '' })}
                                  className="px-3 py-2 border rounded-lg hover:bg-gray-50 font-semibold">Request Return</button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {accountTab === 'profile' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow max-w-xl`}>
              <h3 className="text-xl font-bold mb-4">Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name</label>
                  <input type="text" value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input type="email" value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input type="tel" value={user.phone || ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => showToast('Profile updated', 'success')} className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">Save</button>
                  <button onClick={() => { setUser(null); showToast('Logged out', 'info'); }} className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50">Logout</button>
                </div>
              </div>
            </div>
          )}

          {accountTab === 'addresses' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h3 className="text-xl font-bold mb-3">Saved Addresses</h3>
                {addresses.length === 0 ? (
                  <p className="text-gray-600">No saved addresses.</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <div key={addr.id} className="border rounded-lg p-3 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cyan-600 mt-1" />
                        <div className="flex-1 text-sm">
                          <div className="font-semibold">{addr.fullName} • {addr.phone}</div>
                          <div className="text-gray-700">{addr.address}, {addr.city}</div>
                          {addr.postalCode && <div className="text-gray-500">{addr.postalCode}</div>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setCheckoutData({
                              ...checkoutData,
                              fullName: addr.fullName,
                              email: addr.email,
                              phone: addr.phone,
                              address: addr.address,
                              city: addr.city,
                              postalCode: addr.postalCode
                            });
                            setCurrentView('checkout');
                            showToast('Address applied to checkout', 'success');
                          }} className="px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm">Use</button>
                          <button onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))} className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h3 className="text-xl font-bold mb-3">Add New Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Full Name" className="px-3 py-2 border rounded-lg" onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })} />
                  <input type="email" placeholder="Email" className="px-3 py-2 border rounded-lg" onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })} />
                  <input type="tel" placeholder="Phone" className="px-3 py-2 border rounded-lg" onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })} />
                  <input type="text" placeholder="City" className="px-3 py-2 border rounded-lg" onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })} />
                  <input type="text" placeholder="Postal Code" className="px-3 py-2 border rounded-lg" onChange={(e) => setCheckoutData({ ...checkoutData, postalCode: e.target.value })} />
                  <textarea placeholder="Address" rows="3" className="md:col-span-2 px-3 py-2 border rounded-lg" onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })} />
                </div>
                <button onClick={() => {
                  if (!checkoutData.fullName || !checkoutData.phone || !checkoutData.address || !checkoutData.city) {
                    showToast('Please fill required fields', 'warning'); return;
                  }
                  const addr = { id: 'ADDR' + Date.now(), fullName: checkoutData.fullName, email: checkoutData.email, phone: checkoutData.phone, address: checkoutData.address, city: checkoutData.city, postalCode: checkoutData.postalCode };
                  setAddresses(prev => [...prev, addr]);
                  showToast('Address saved', 'success');
                }} className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">Save Address</button>
              </div>
            </div>
          )}

          {accountTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h3 className="text-xl font-bold mb-3">My Tickets</h3>
                {tickets.length === 0 ? (
                  <p className="text-gray-600">No support tickets.</p>
                ) : (
                  <div className="space-y-3">
                    {tickets.slice().reverse().map(t => (
                      <div key={t.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{t.subject}</div>
                          <span className={`text-xs px-2 py-1 rounded ${t.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{t.status}</span>
                        </div>
                        <div className="text-sm text-gray-600">{formatDate(t.date)}</div>
                        <p className="text-sm mt-2 text-gray-700">{t.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
                <h3 className="text-xl font-bold mb-3">New Ticket</h3>
                <div className="space-y-3">
                  <input id="ticketSubject" type="text" placeholder="Subject" className="w-full px-3 py-2 border rounded-lg" />
                  <textarea id="ticketMessage" placeholder="Describe your issue" rows="4" className="w-full px-3 py-2 border rounded-lg" />
                  <button onClick={() => {
                    const subject = document.getElementById('ticketSubject').value.trim();
                    const message = document.getElementById('ticketMessage').value.trim();
                    if (!subject || !message) { showToast('Please fill subject and message', 'warning'); return; }
                    const t = { id: 'TIC' + Date.now(), subject, message, status: 'Open', date: new Date().toISOString() };
                    setTickets(prev => [...prev, t]);
                    showToast('Ticket submitted', 'success');
                    document.getElementById('ticketSubject').value = '';
                    document.getElementById('ticketMessage').value = '';
                  }} className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (currentView === 'product') {
    return <ProductView />;
  }

  if (currentView === 'account') {
    return <AccountView />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Toast />
      <QuickViewModal />
      <ComparisonModal />
      <AuthModal />
      <LiveChat />
      <NewsletterPopup />
      <FiltersSidebar />
      <CartSidebar />
      
      {zoomedImage && (
  <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-40`}>
        <div className="bg-cyan-500 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>📧 support@interstellar.com</span>
              <span>📞 +256-700-123-456</span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-cyan-600 px-2 py-1 rounded text-white text-xs"
              >
                <option value="UGX">UGX</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <button onClick={() => setDarkMode(!darkMode)} className="p-1 hover:bg-cyan-600 rounded">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-cyan-600" />
              <h1 className="text-3xl font-bold text-cyan-600">Interstellar</h1>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <Filter className="w-6 h-6" />
              </button>

              <button
                onClick={() => wishlist.length > 0 ? showToast(`${wishlist.length} items in wishlist`, 'info') : showToast('Wishlist is empty', 'info')}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => compareProducts.length > 0 ? setCompareProducts(compareProducts) : showToast('No products to compare', 'info')}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <TrendingUp className="w-6 h-6" />
                {compareProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {compareProducts.length}
                  </span>
                )}
              </button>

              {user ? (
                <button
                  onClick={() => { setAccountTab('orders'); setCurrentView('account'); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Account"
                >
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Login"
                >
                  <User className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={() => setShowCart(true)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-6 overflow-x-auto py-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                      selectedCategory === category.id
                        ? 'bg-cyan-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">Flash Sale!</h2>
                <p className="text-lg mb-4">Up to 50% off on selected items</p>
                <button
                  onClick={() => {
                    const flashProducts = products.filter(p => p.flashSale);
                    if (flashProducts.length > 0) {
                      viewProductDetails(flashProducts[0]);
                    }
                  }}
                  className="bg-white text-cyan-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  Shop Now
                </button>
              </div>
              <Zap className="w-24 h-24 opacity-50" />
            </div>
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-cyan-600" />
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentlyViewed.map((product) => (
                <div
                  key={product.id}
                  onClick={() => viewProductDetails(product)}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow hover:shadow-lg transition cursor-pointer`}
                >
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                    <p className="text-cyan-600 font-bold">{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-gray-500 text-lg ml-2">({filteredProducts.length})</span>
          </h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLiveChat(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden md:inline">Help</span>
            </button>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange([0, 5000000]);
                setMinRating(0);
              }}
              className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow hover:shadow-xl transition group relative`}
              >
                {product.flashSale && (
                  <div className="absolute top-2 left-2 z-10">
                    <FlashSaleTimer endTime={product.flashSaleEnd} />
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-bold z-10">
                    -{product.discount}%
                  </div>
                )}

                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition duration-300 cursor-pointer"
                    onClick={() => viewProductDetails(product)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition hover:scale-110"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition hover:scale-110"
                    >
                      <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                    </button>
                    <button
                      onClick={() => toggleCompare(product)}
                      className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition hover:scale-110"
                    >
                      <TrendingUp className={`w-5 h-5 ${compareProducts.find(p => p.id === product.id) ? 'text-blue-500' : 'text-gray-700'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                  </div>

                  <h3
                    className="font-semibold text-lg mb-2 truncate cursor-pointer hover:text-cyan-600"
                    onClick={() => viewProductDetails(product)}
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-cyan-600">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                    )}
                  </div>

                  {product.bulkDiscount && (
                    <p className="text-xs text-green-600 mb-2">
                      Buy {product.bulkDiscount.quantity}+ save {product.bulkDiscount.discount * 100}%
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {product.stock} left
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {product.views}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      product.inStock
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white mt-16`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-8 h-8 text-cyan-600" />
                <h3 className="text-2xl font-bold">Interstellar</h3>
              </div>
              <p className="text-gray-400 mb-4">Your one-stop shop for quality products at unbeatable prices.</p>
              <div className="flex gap-3">
                <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-600 transition">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition">Contact</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition">FAQs</a></li>
                <li><a href="#" className="hover:text-cyan-600 transition">Shipping Info</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(1).map(cat => (
                  <li key={cat.id}>
                    <button onClick={() => setSelectedCategory(cat.id)} className="hover:text-cyan-600 transition">
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe for exclusive deals!</p>
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={() => showToast('Subscribed!', 'success')}
                  className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition font-semibold"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Interstellar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App