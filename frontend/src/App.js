import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDestinations from './pages/AdminDestinations';
import AdminHotels from './pages/AdminHotels';
import AdminSettings from './pages/AdminSettings';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/destinations" element={
            <ProtectedRoute><AdminDestinations /></ProtectedRoute>
          } />
          <Route path="/admin/hotels" element={
            <ProtectedRoute><AdminHotels /></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute><AdminSettings /></ProtectedRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </AuthProvider>
  );
}
