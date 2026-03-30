import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function ShoppingCart() {
  const { items, removeItem, addItem, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <p className="text-gray-500 font-medium">A kosarad jelenleg üres.</p>
        <p className="text-sm text-gray-400 mt-1">Válassz valamit a finom kínálatunkból!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-amber-600" />
        Kosár tartalma
      </h2>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">

            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
              <p className="text-amber-600 font-bold">{item.product.price} Ft</p>
            </div>

            {/* Amount controller */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    addItem(item.product, -1);
                  } else {
                    removeItem(item.product.id);
                  }
                }}
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-white rounded shadow-sm transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-4 text-center text-sm font-bold text-gray-900">
                {item.quantity}
              </span>

              <button
                onClick={() => addItem(item.product, 1)}
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-white rounded shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={() => removeItem(item.product.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
              title="Eltávolítás"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-5">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-500">Összesen fizetendő:</span>
          <span className="font-extrabold text-2xl text-gray-900">{getTotalPrice()} Ft</span>
        </div>

        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
          Tovább a rendelés leadásához
        </button>
      </div>
    </div>
  );
}