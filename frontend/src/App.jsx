import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import SecurityPrivacy from './components/SecurityPrivacy';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import OtpPage from './pages/OtpPage';
import Settings from './pages/Settings'; // Import Settings page if needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/products" element={<Products />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/security-privacy" element={<SecurityPrivacy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OtpPage />} /> {/* ✅ Add this line */}
    </Routes>
  );
}

export default App;
