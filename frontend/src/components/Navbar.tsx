import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Utensils, User, FileText } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Kezdőlap", path: "/", icon: <Utensils className="w-5 h-5" /> },
    {
      name: "Menü & Rendelés",
      path: "/order",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Rendeléseim",
      path: "/orders",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition"
        >
          <Utensils className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">
            Buffet<span className="text-gray-800">App</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-amber-600"
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User & Cart Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition"
          >
            <User className="w-5 h-5" />
          </Link>

          <button className="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 bg-amber-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
