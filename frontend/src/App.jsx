import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import OtpPage from './pages/OtpPage';
import Settings from './pages/Settings'; // Import Settings page if needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpPage />} /> {/* ✅ Add this line */}
    </Routes>
  );
}

export default App;
