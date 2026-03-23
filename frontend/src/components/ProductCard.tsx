import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
    // Később ide teszünk egy szép "Toast" értesítést is!
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
      {/* Kép helyőrző (Később a valós képet töltjük be) */}
      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <span className="text-sm font-medium">Nincs kép</span>
          </div>
        )}
        {!product.isActive && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Elfogyott
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
          <span className="text-lg font-extrabold text-amber-600 whitespace-nowrap ml-2">
            {product.price} Ft
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 flex-grow mb-4">
          {product.description || 'Friss és finom választás a nap bármely szakában.'}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={!product.isActive || product.stockQuantity < 1}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          {product.isActive && product.stockQuantity > 0 ? 'Kosárba' : 'Jelenleg nem elérhető'}
        </button>
      </div>
    </div>
  );
}