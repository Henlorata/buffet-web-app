import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BartOrders from "./pages/BartOrders";
import Users from "./pages/Users";
import AdminOrders from "./pages/AdminOrders";
import Products from "./pages/Products";

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

          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Private */}
              <Route path="/orders" element={isLoggedIn ? <OrdersPage /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/bart-orders" element={isLoggedIn ? <BartOrders /> : <Navigate to="/login" />} />
              <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" />} />
              <Route path="/admin-orders" element={isLoggedIn ? <AdminOrders /> : <Navigate to="/login" />} />
              <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster richColors position="top-center" />
      </Router>
    </QueryClientProvider>
  );
}