import {Link, useLocation} from 'react-router-dom';
import {ShoppingBag, Utensils, User as UserIcon, FileText, WalletCards} from 'lucide-react';
import {useCartStore} from '../store/cartStore';
import {useAuthStore} from '../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

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

        {/* User & Cart Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/profile"
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition"
                  title="Profil">
              <UserIcon className="w-5 h-5"/>
            </Link>
          ) : (
            <Link to="/login"
                  className="hidden sm:inline-flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold px-4 py-2 rounded-full transition">
              Bejelentkezés
            </Link>
          )}
         {(user && user.role !== 'ADMIN') ? (
          <button className="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full transition">
            <ShoppingBag className="w-5 h-5"/>
            {cartCount > 0 && (
              <span
                className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 bg-amber-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>) : null}
        </div>
      </div>
    </header>
  );
}