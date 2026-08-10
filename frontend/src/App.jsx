import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import BookingHistory from './pages/BookingHistory';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminMovies from './pages/admin/AdminMovies';
import AdminTheaters from './pages/admin/AdminTheaters';
import AdminShows from './pages/admin/AdminShows';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        <Route path="/book/:showId" element={
          <ProtectedRoute><SeatSelection /></ProtectedRoute>
        } />
        <Route path="/payment/:bookingId" element={
          <ProtectedRoute><Payment /></ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute><BookingHistory /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="theaters" element={<AdminTheaters />} />
          <Route path="shows" element={<AdminShows />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <h3>404 — Page not found</h3>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      </div>
    </div>
  );
}
