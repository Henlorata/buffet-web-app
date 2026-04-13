import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api/axiosInstance';
import { toast } from 'sonner';

export default function ShoppingCart({ onClose }: { onClose?: () => void }) {
  const { items, removeItem, addItem, getTotalPrice, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      console.log("Sent data to the backend:", orderData);
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Rendelés leadva! A pultos már készíti is.');
      clearCart();
      if (onClose) onClose();
      navigate(`/tracking/${data.order.id}`);
    },
    onError: (error: any) => {
      const zodErrors = error.response?.data?.details;

      if (zodErrors && Array.isArray(zodErrors)) {
        console.error("Zod validation error:", zodErrors);

        toast.error(`Invalid data: ${zodErrors[0].message}`);
        return;
      }

      const errorMsg = error.response?.data?.error || 'Unknown error';

      if (error.response?.status === 409) {
        toast.error('⚠There is not enough stock of one of the products.!');
      } else {
        toast.error(`Error: ${errorMsg}`);
      }
    }
  });

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please log in to proceed with your order.');
      if (onClose) onClose();
      navigate('/login');
      return;
    }

    const orderPayload = {
      items: items.map(item => ({
        productId: String(item.product.id),
        quantity: Number(item.quantity)
      }))
    };

    createOrderMutation.mutate(orderPayload);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
        <div className="w-20 h-20 bg-white shadow-sm text-slate-300 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <p className="text-slate-500 font-bold text-lg">A kosarad jelenleg üres.</p>
        <p className="text-sm text-slate-400 mt-2">Itt az ideje választani valami finomat!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-50 group">
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
              <p className="text-amber-500 font-black">{item.product.price} Ft</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
              <button
                onClick={() => item.quantity > 1 ? addItem(item.product, -1) : removeItem(item.product.id)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg shadow-sm transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
              <button
                onClick={() => addItem(item.product, 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.product.id)}
              className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
        <div className="flex justify-between items-end mb-6">
          <span className="font-bold text-slate-500">Összesen:</span>
          <span className="font-black text-3xl text-slate-900">{getTotalPrice()} Ft</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={createOrderMutation.isPending}
          className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-amber-500 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95"
        >
          {createOrderMutation.isPending ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> Dolgozunk rajta...</>
          ) : (
            'Tovább a rendeléshez'
          )}
        </button>
      </div>
    </div>
  );
}