import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken; 

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          {isLoggedIn && <Navbar />}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Logged in? */}
              <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
              
              <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/register" element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/" />} />

              {/* Protected Routes */}
              <Route path="/order" element={isLoggedIn ? <OrderPage /> : <Navigate to="/login" />} />
              <Route path="/orders" element={isLoggedIn ? <OrdersPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
              
              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}