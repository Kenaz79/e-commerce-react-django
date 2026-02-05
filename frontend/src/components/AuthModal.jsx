import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

function AuthModal({ 
  showAuthModal, 
  setShowAuthModal, 
  darkMode, 
  authMode, 
  setAuthMode, 
  apiService, 
  setUser, 
  showToast,
  setCurrentView,
  setAccountTab,
  setOrders,
  setAddresses,
  setTickets
}) {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!showAuthModal) return null;

  const validatePasswords = (password, confirmPassword) => {
    const match = password === confirmPassword;
    setPasswordsMatch(match);
    return match;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);
    
    try {
      let response;
      if (authMode === 'login') {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        response = await apiService.login({ email, password });
      } else {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (!validatePasswords(password, confirmPassword)) {
          setFormError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        response = await apiService.register({ 
          username: name.split(' ')[0] || name,
          name, 
          email, 
          password, 
          confirm_password: confirmPassword 
        });
      }
      
      if (response.token || response.access) {
        const token = response.token || response.access;
        const user = response.user || {
          id: response.id,
          username: response.username,
          email: response.email,
          name: response.name || response.username
        };
        
        setUser(user);
        apiService.setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        setShowAuthModal(false);
        showToast(authMode === 'login' ? 'Logged in successfully!' : 'Account created!', 'success');
        
        // Load user data after login
        const [ordersData, addressesData, ticketsData] = await Promise.all([
          apiService.getOrders().catch(() => []),
          apiService.getAddresses().catch(() => []),
          apiService.getTickets().catch(() => [])
        ]);
        
        setOrders(ordersData);
        setAddresses(addressesData);
        setTickets(ticketsData);
      } else {
        const errorMessage = response.detail || response.message || 'Authentication failed';
        showToast(errorMessage, 'error');
        setFormError(errorMessage);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error.message || 'Authentication failed';
      showToast(errorMessage, 'error');
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setFormError('');
    setPasswordsMatch(true);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setFormError('');
    setPasswordsMatch(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">{authMode === 'login' ? 'Login' : 'Create Account'}</h2>
          <button 
            onClick={closeModal}
            className="p-2 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            disabled={isLoading}
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>
        
        {formError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'register' && (
            <div>
              <input
                id="register-name"
                type="text"
                placeholder="Full Name"
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
          
          <div>
            <input
              id={authMode === 'login' ? 'login-email' : 'register-email'}
              type="email"
              placeholder="Email"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <div className="relative">
            <input
              id={authMode === 'login' ? 'login-password' : 'register-password'}
              type={authMode === 'login' ? (showLoginPassword ? 'text' : 'password') : (showRegisterPassword ? 'text' : 'password')}
              placeholder="Password"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 pr-10 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              onClick={() => authMode === 'login' 
                ? setShowLoginPassword(!showLoginPassword) 
                : setShowRegisterPassword(!showRegisterPassword)
              }
              disabled={isLoading}
            >
              {authMode === 'login' 
                ? (showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />)
                : (showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />)
              }
            </button>
          </div>
          
          {authMode === 'register' && (
            <div>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 pr-10 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    !passwordsMatch ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  onChange={(e) => {
                    const password = document.getElementById('register-password').value;
                    validatePasswords(password, e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={(authMode === 'register' && !passwordsMatch) || isLoading}
          >
            {isLoading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm dark:text-gray-300">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={switchAuthMode}
            className="text-cyan-500 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {authMode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;