import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import ShoppingCart from '../components/ShoppingCart';
import { useTranslation } from 'react-i18next';

export default function CartPage() {
  const { t } = useTranslation();
  const items = useCartStore((state) => state.items);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/products" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('cartPage.backToProducts')}
            </Link>
            <h1 className="text-3xl font-black text-slate-900">{t('cartPage.title')}</h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-sm font-bold text-slate-500">{t('cartPage.itemsCount')} </span>
            <span className="text-lg font-black text-amber-500">{items.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[600px]">
          <ShoppingCart />
        </div>
      </div>
    </div>
  );
}