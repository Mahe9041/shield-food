import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages — we will create these one by one
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import PaymentsPage from './pages/PaymentsPage';

// Components
import Navbar from './components/Navbar';

// ProtectedRoute — wraps any page that requires login
// If user is not logged in, redirect to /login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: 'var(--accent)',
        fontFamily: 'Bebas Neue, cursive', fontSize: 22, letterSpacing: '0.1em'
      }}>
        INITIALIZING SHIELD...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Layout — wraps protected pages with the Navbar
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

// AppRoutes — separated so it can use useAuth (which needs AuthProvider above it)
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public route — redirect to home if already logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
      } />
      <Route path="/restaurants" element={
        <ProtectedRoute><Layout><RestaurantsPage /></Layout></ProtectedRoute>
      } />
      <Route path="/restaurants/:id" element={
        <ProtectedRoute><Layout><RestaurantDetailPage /></Layout></ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute><Layout><CartPage /></Layout></ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute><Layout><PaymentsPage /></Layout></ProtectedRoute>
      } />

      {/* Catch all — redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-raised)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}