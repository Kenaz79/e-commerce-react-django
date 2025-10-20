import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, Heart, User, Star, TrendingUp, Smartphone, Laptop, Home, Shirt, X, ArrowLeft, Plus, Minus, Package, CreditCard, MapPin, Phone, Mail, Filter, SortAsc, Eye, Clock, Gift, Percent, MessageCircle, Bell, Sun, Moon, ChevronRight, Share2, Truck, Download, Zap, Users, Tag, Check } from 'lucide-react';

function App() {
  const [cart, setCart] = useState([]);
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

  const categories = [
    { id: 'all', name: 'All Products', icon: Menu },
    { id: 'electronics', name: 'Electronics', icon: Laptop },
    { id: 'phones', name: 'Phones', icon: Smartphone },
    { id: 'fashion', name: 'Fashion', icon: Shirt },
    { id: 'home', name: 'Home & Garden', icon: Home },
  ];

  const promoCodes = {
    'SAVE10': { discount: 0.10, type: 'percentage' },
    'FLASH50': { discount: 50000, type: 'fixed' },
    'WELCOME20': { discount: 0.20, type: 'percentage' }
  };

  const products = [
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
    // ... rest of the products array ...
  ];

  // ... rest of the component code ...

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
      
      {/* ... rest of the JSX ... */}
    </div>
  );
}

export default App;