import { ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function OrdersPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Nincs bejelentkezve</h2>
        <p className="text-gray-500 max-w-md">Jelentkezz be, hogy megtekinthesd a korábbi és folyamatban lévő rendeléseidet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900">Rendeléseim</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">Majd a rendelések itt a backend után.</p>
      </div>
    </div>
  );
}