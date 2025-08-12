import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage'; // <-- Make sure it points to DashboardPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* This is the corrected route */}
        <Route path="/dashboard" element={<DashboardPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;