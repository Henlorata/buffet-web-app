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
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!accessToken;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">

          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Private */}
              <Route path="/orders" element={isLoggedIn && (user?.role === "BARTENDER" || user?.role === "CUSTOMER") ? <OrdersPage /> : <Navigate to="/profile" />} />
              <Route path="/profile" element={isLoggedIn  ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/bart-orders" element={isLoggedIn && (user?.role === "BARTENDER") ? <BartOrders /> : <Navigate to="/profile" />} />
              <Route path="/users" element={isLoggedIn && (user?.role === "ADMIN") ? <Users /> : <Navigate to="/profile" />} />
              <Route path="/admin-orders" element={isLoggedIn && (user?.role === "ADMIN") ? <AdminOrders /> : <Navigate to="/profile" />} />
              <Route path="/products" element={isLoggedIn && (user?.role === "ADMIN") ? <Products /> : <Navigate to="/profile" />} />

              <Route path="*" element={<Navigate to="/profile" />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster richColors position="top-center" />
      </Router>
    </QueryClientProvider>
  );
}