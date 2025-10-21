import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyerApp from './components/BuyerApp';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BuyerApp />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;