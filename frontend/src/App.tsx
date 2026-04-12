import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import { Toaster, toast } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Socket
import { io } from "socket.io-client";
import { useNotificationStore } from "./store/notificationStore";

// Pages
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BartOrders from "./pages/BartOrders";
import TrackingPage from "./pages/TrackingPage";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Stats from "./pages/Stats";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

export default function App() {
  const { user, accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;
  const addNotification = useNotificationStore(s => s.addNotification);

  useEffect(() => {
    if (!user) return;
    const socket = io('http://localhost:5000', { withCredentials: true });

    if (user.role === 'BARTENDER' || user.role === 'ADMIN') {
      socket.on('new-order-received', (order) => {
        addNotification({ title: 'Új rendelés érkezett!', message: `${order.user?.fullName || 'Vendég'} leadott egy új rendelést.`, type: 'info' });
        toast.info("Új rendelés érkezett a konyhára!");
      });
    }

    socket.on('order-status-updated', (order) => {
      if (String(order.userId) === String(user.id)) {
        let title = "Rendelés frissítés";
        let message = `A #${order.id.split('-')[0]} rendelésed új állapota: ${order.status}`;

        if (order.status === 'PREPARING') { title = "Készül a rendelésed!"; message = "A pultos megkezdte a rendelésed összeállítását."; }
        else if (order.status === 'READY') { title = "Átvehető!"; message = "A rendelésed elkészült, várunk a pultnál!"; }
        else if (order.status === 'CANCELLED') { title = "Rendelés törölve"; message = `Rendelésedet töröltük. Indok: ${order.cancellationReason || 'Nincs megadva'}`; }

        if (order.status !== 'COMPLETED') {
          addNotification({ title, message, type: 'info' });
          toast.success(title);
        }
      }
    });

    return () => { socket.disconnect(); };
  }, [user, addNotification]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth */}
              <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/order" />} />
              <Route path="/register" element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/order" />} />

              {/* Protected */}
              <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/orders" element={isLoggedIn ? <OrdersPage /> : <Navigate to="/login" />} />
              <Route path="/tracking/:id" element={isLoggedIn ? <TrackingPage /> : <Navigate to="/login" />} />
              <Route path="/bart-orders" element={isLoggedIn ? <BartOrders /> : <Navigate to="/login" />} />

              {/* Admin */}
              <Route path="/products" element={isLoggedIn && user?.role === 'ADMIN' ? <Products /> : <Navigate to="/login" />} />
              <Route path="/users" element={isLoggedIn && user?.role === 'ADMIN' ? <Users /> : <Navigate to="/login" />} />
              <Route path="/stats" element={isLoggedIn && user?.role === 'ADMIN' ? <Stats /> : <Navigate to="/login" />} />

              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster richColors position="top-center" />
      </Router>
    </QueryClientProvider>
  );
}