import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, Heart, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string; name: string; description: string; price: number; stockQuantity: number; imageUrl: string | null; isActive: boolean;
  category: { name: string; slug: string };
  favoritedBy: { id: string }[];
}

export default function OrderPage() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products')).data,
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  const categories = Array.from(new Set(products?.map(p => p.category.name) || []));

  const filteredProducts = products?.filter(p => p.isActive).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || p.category.name === activeCategory;
    const matchesFavorite = !showFavoritesOnly || p.favoritedBy.some(fav => fav.userId === user?.id);
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="max-w-7xl mx-auto pt-4 pb-12 animate-in fade-in duration-500">

      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="text-white w-full md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-4">
            <UtensilsCrossed className="w-10 h-10 text-amber-500" /> {t('menu.title')}
          </h1>
          <p className="text-slate-400 font-medium text-lg">{t('menu.subtitle')}</p>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder={t('menu.searchPlaceholder')}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium text-lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === 'all' ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
            >
              {t('menu.allCategories')}
            </button>
            {categories.map(cat => (
              <button
                key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
              >
                {cat}
              </button>
            ))}

            {user && (
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${showFavoritesOnly ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} /> {t('menu.favorites')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-2xl font-black text-slate-800 mb-2">{t('menu.noResults')}</h3>
            <p className="text-slate-500">{t('menu.noResultsDesc')}</p>
          </div>
        ) : (
          filteredProducts?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}