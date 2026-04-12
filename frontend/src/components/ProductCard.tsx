import { Plus, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';

export default function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);
  const isFavorite = product.favoritedBy?.some(fav => fav.userId === user?.id);

  const toggleFavMutation = useMutation({
    mutationFn: async () => api.post(`/products/${product.id}/favorite`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} a kosárba került!`, { duration: 2000 });
  };

  return (
    <div className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-white/40 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-1">

      <div className="relative h-60 w-full bg-slate-50 overflow-hidden p-2">
        <div className="w-full h-full rounded-3xl overflow-hidden relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 text-amber-300">
              <span className="text-xl font-black opacity-50">BuffetApp</span>
            </div>
          )}
        </div>

        <div className="absolute top-6 left-6 flex gap-2">
          {user && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavMutation.mutate(); }}
              className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all z-10 hover:scale-110 ${isFavorite ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/80 text-slate-400 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
          {!product.isActive && (
            <span className="bg-red-500/95 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">
              ELFOGYOTT
            </span>
          )}
        </div>

        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white">
          <span className="text-xl font-black text-slate-900">{product.price} Ft</span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-1 group-hover:text-amber-500 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500 line-clamp-2 flex-grow mb-8 font-medium leading-relaxed">
          {product.description || 'Friss és ropogós, egyenesen a konyhából a kezedbe.'}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={!product.isActive || product.stockQuantity < 1}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-900 text-slate-900 hover:text-white disabled:bg-slate-50 disabled:text-slate-300 font-bold py-4 rounded-2xl transition-all duration-300 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {product.isActive && product.stockQuantity > 0 ? 'Kosárba rakom' : 'Jelenleg nem elérhető'}
        </button>
      </div>
    </div>
  );
}