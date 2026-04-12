import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {ShoppingBag, Utensils, User, FileText, X, UserIcon, WalletCards} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ShoppingCart from './ShoppingCart';

export default function Navbar() {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  const navLinks = [
  {
    name: 'Kezdőlap',
    path: '/home',
    icon: <Utensils className="w-5 h-5"/>,
    hiddenFor: ['BARTENDER', 'ADMIN']
  },
  {
    name: 'Vásárlói Rendelések',
    path: '/bart-orders',
    icon: <WalletCards className="w-5 h-5"/>,
    roles: ['BARTENDER']
  },
  {
    name: 'Menü & Rendelés',
    path: '/order',
    icon: <FileText className="w-5 h-5"/>,
    hiddenFor: ['ADMIN']
  },
  {
    name: 'Rendeléseim',
    path: '/orders',
    icon: <ShoppingBag className="w-5 h-5"/>,
    roles: ['CUSTOMER', 'BARTENDER']
  },
  {
    name: 'Felhasználók',
    path: '/users',
    icon: <UserIcon className="w-5 h-5"/>,
    roles: ['ADMIN']
  },
  {
    name: 'Termékek',
    path: '/products',
    icon: <FileText className="w-5 h-5"/>,
    roles: ['ADMIN']
  },
  {
    name: 'Rendelések',
    path: '/admin-orders',
    icon: <FileText className="w-5 h-5"/>,
    roles: ['ADMIN']
  }
];

const visibleLinks = navLinks.filter(link => {
  let userRole;
  if (user) {
    userRole = user.role;
  } else {
    userRole = 'GUEST';
  }

  // if the given link is hidden for the user's role, return false
  if (link.hiddenFor?.includes(userRole)) return false;

  // if the given link is visible for the user's role, return true
  if (link.roles && !link.roles.includes(userRole)) return false;

  // default: show the link
  return link;
});

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to={location.pathname} className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition">
          <Utensils className="w-8 h-8"/>
          <span className="text-xl font-bold tracking-tight">Buffet<span className="text-gray-800">App</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/profile" className="flex items-center justify-center w-11 h-11 bg-white text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-full transition shadow-sm border border-gray-100" title="Profil">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-md hover:shadow-lg">
                Bejelentkezés
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-11 h-11 bg-white text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-full transition shadow-sm border border-gray-100 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[450px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col sm:rounded-l-3xl overflow-hidden ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100 z-10">
          <h2 className="text-2xl font-black text-slate-900">Kosaram</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ShoppingCart onClose={() => setIsCartOpen(false)} />
        </div>
      </div>
    </>
  );
}