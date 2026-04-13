import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Utensils, User, FileText, X, Package, Users as UsersIcon, ChefHat, TrendingUp, Languages, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ShoppingCart from './ShoppingCart';
import NotificationCenter from './NotificationCenter';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const { user, logout: logoutStore } = useAuthStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'hu' ? 'en' : 'hu';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      logoutStore();
      toast.success(t('nav.logout_success'));
      navigate('/home');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const getNavLinks = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: t('nav.inventory'), path: '/products', icon: <Package className="w-5 h-5" /> },
        { name: t('nav.users'), path: '/users', icon: <UsersIcon className="w-5 h-5" /> },
        { name: t('nav.stats'), path: '/stats', icon: <TrendingUp className="w-5 h-5" /> },
      ];
    }

    if (user?.role === 'BARTENDER') {
      return [
        { name: t('nav.kitchen'), path: '/bart-orders', icon: <ChefHat className="w-5 h-5" /> },
      ];
    }

    const links = [
      { name: t('nav.home'), path: '/home', icon: <Utensils className="w-5 h-5" /> },
      { name: t('nav.menu'), path: '/order', icon: <FileText className="w-5 h-5" /> },
    ];

    if (user?.role === 'CUSTOMER') {
      links.push({ name: t('nav.orders'), path: '/orders', icon: <ShoppingBag className="w-5 h-5" /> });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          <Link to={user?.role === 'ADMIN' ? '/products' : user?.role === 'BARTENDER' ? '/bart-orders' : '/home'} className="flex items-center gap-2 text-amber-500 hover:text-amber-600 transition group shrink-0">
            <div className="bg-amber-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">Buffet<span className="text-amber-500">App</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 bg-white/50 px-8 py-3 rounded-full border border-gray-100 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                  location.pathname === link.path ? 'text-amber-500' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded-full transition-all text-xs font-black uppercase"
            >
              <Languages className="w-4 h-4" />
              {i18n.language === 'hu' ? 'HU' : 'EN'}
            </button>

            {user && <NotificationCenter />}

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center justify-center w-11 h-11 bg-white text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-full transition shadow-sm border border-gray-100" title={t('nav.profile')}>
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-11 h-11 bg-white text-red-500 hover:bg-red-50 rounded-full transition shadow-sm border border-gray-100"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-md hover:shadow-lg">
                {t('nav.login')}
              </Link>
            )}

            {(!user || user.role === 'CUSTOMER') && (
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
            )}
          </div>
        </div>
      </header>

      {(!user || user.role === 'CUSTOMER') && (
        <>
          <div
            className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsCartOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[450px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col sm:rounded-l-3xl overflow-hidden ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100 z-10">
              <h2 className="text-2xl font-black text-slate-900">{t('nav.my_cart')}</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ShoppingCart onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  );
}