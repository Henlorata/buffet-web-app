import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { ChefHat, CheckCircle2, Play, Check, RefreshCw, AlertCircle, Clock, Trash2, X, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  quantity: number;
  product: { name: string };
}

interface Order {
  id: string;
  status: 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  user?: { fullName: string };
  handledBy?: { fullName: string };
  items: OrderItem[];
}

export default function BartOrders() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const { data: orders, isLoading, isError, isFetching } = useQuery<Order[]>({
    queryKey: ['bartender-orders'],
    queryFn: async () => {
      const response = await api.get('/orders?view=kitchen');
      return response.data;
    },
    refetchInterval: 10000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, reason, adminCode }: { orderId: string; status: string; reason?: string; adminCode?: string }) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status, reason, adminCode });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bartender-orders'] });

      if (variables.status === 'CANCELLED') {
        toast.success('Rendelés sikeresen törölve, készlet visszatöltve!');
        closeCancelModal();
      } else if (variables.status === 'PREPARING') toast.info('Rendelés megkezdve!');
      else if (variables.status === 'READY') toast.success('Rendelés átvehető!');
      else if (variables.status === 'COMPLETED') toast.success('Rendelés lezárva!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Hiba a státusz frissítésekor');
    }
  });

  const handleCancelSubmit = () => {
    if (!cancelOrder) return;

    if (cancelOrder.status !== 'NEW') {
      if (cancelReason.trim().length < 5) {
        toast.error('Kérlek adj meg egy érvényes indokot (min. 5 karakter)!');
        return;
      }
      if (user?.role !== 'ADMIN' && adminCode.trim() === '') {
        toast.error('Az adminisztrátori kód megadása kötelező!');
        return;
      }
    }

    updateStatusMutation.mutate({
      orderId: cancelOrder.id,
      status: 'CANCELLED',
      reason: cancelReason,
      adminCode: adminCode
    });
  };

  const closeCancelModal = () => {
    setCancelOrder(null);
    setCancelReason("");
    setAdminCode("");
  };

  const getElapsedTime = (createdAt: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / 60000);
    if (minutes < 1) return 'Most';
    return `${minutes} perce`;
  };

  const newOrders = orders?.filter(o => o.status === 'NEW') || [];
  const preparingOrders = orders?.filter(o => o.status === 'PREPARING') || [];
  const readyOrders = orders?.filter(o => o.status === 'READY') || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-amber-500">
        <RefreshCw className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Konyhai kijelző betöltése...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <AlertCircle className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-black text-slate-900">Hiba a kapcsolatban!</h2>
        <p className="text-slate-500">Szólj az adminnak, nem érhető el a szerver.</p>
      </div>
    );
  }

  const OrderCard = ({ order, accentColor, nextStatus, nextLabel, NextIcon }: any) => (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${accentColor} p-5 flex flex-col gap-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 relative group`}>

      {/* Törlés Gomb a sarokban */}
      <button
        onClick={() => setCancelOrder(order)}
        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Rendelés Törlése"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="flex justify-between items-start pr-10">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            #{order.id.split('-')[0]}
          </p>
          <h3 className="font-black text-slate-900 text-lg leading-tight">
            {order.user?.fullName || 'Ismeretlen vásárló'}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-sm font-bold">
          <Clock className="w-4 h-4" />
          <span className={getElapsedTime(order.createdAt) !== 'Most' && parseInt(getElapsedTime(order.createdAt)) > 10 ? 'text-red-500 animate-pulse' : ''}>
            {getElapsedTime(order.createdAt)}
          </span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 space-y-2 flex-grow">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between items-start border-b border-slate-200/50 last:border-0 pb-2 last:pb-0">
            <span className="font-bold text-slate-800 text-sm leading-tight pr-2">{item.product.name}</span>
            <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm text-sm border border-slate-200 flex-shrink-0">
              {item.quantity}x
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: nextStatus })}
        disabled={updateStatusMutation.isPending}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all active:scale-95 text-white shadow-md ${
          nextStatus === 'PREPARING' ? 'bg-amber-500 hover:bg-amber-600' :
            nextStatus === 'READY' ? 'bg-emerald-500 hover:bg-emerald-600' :
              'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <NextIcon className="w-5 h-5" />
        {nextLabel}
      </button>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto min-h-[85vh] flex flex-col pt-4 pb-8">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-amber-500" />
            Konyhai Irányítópult
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Kezeld a beérkező rendeléseket valós időben.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-amber-500' : ''}`} />
          {isFetching ? 'Frissítés...' : 'Automatikus szinkronizáció bekapcsolva'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start flex-grow">

        {/* ÚJ RENDELÉSEK */}
        <div className="bg-slate-100/50 rounded-3xl p-4 flex flex-col border border-slate-200 h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2 shrink-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Új beérkező
            </h2>
            <span className="bg-white text-slate-900 font-black px-3 py-1 rounded-full shadow-sm text-sm">{newOrders.length}</span>
          </div>
          {/* EZ A DIV LETT GÖRGETHETŐ: overflow-y-auto */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 flex-grow">
            {newOrders.map(order => <OrderCard key={order.id} order={order} accentColor="border-blue-500" nextStatus="PREPARING" nextLabel="Készítés megkezdése" NextIcon={Play} />)}
            {newOrders.length === 0 && <p className="text-center text-slate-400 font-medium py-8 italic">Nincs új rendelés</p>}
          </div>
        </div>

        {/* KÉSZÜL */}
        <div className="bg-slate-100/50 rounded-3xl p-4 flex flex-col border border-slate-200 h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2 shrink-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span> Készül
            </h2>
            <span className="bg-white text-slate-900 font-black px-3 py-1 rounded-full shadow-sm text-sm">{preparingOrders.length}</span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 flex-grow">
            {preparingOrders.map(order => <OrderCard key={order.id} order={order} accentColor="border-amber-500" nextStatus="READY" nextLabel="Kész, mehet a pultra!" NextIcon={CheckCircle2} />)}
            {preparingOrders.length === 0 && <p className="text-center text-slate-400 font-medium py-8 italic">Jelenleg nem készül semmi</p>}
          </div>
        </div>

        {/* ÁTVEHETŐ */}
        <div className="bg-slate-100/50 rounded-3xl p-4 flex flex-col border border-slate-200 h-[calc(100vh-220px)] min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2 shrink-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Átvehető
            </h2>
            <span className="bg-white text-slate-900 font-black px-3 py-1 rounded-full shadow-sm text-sm">{readyOrders.length}</span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 flex-grow">
            {readyOrders.map(order => <OrderCard key={order.id} order={order} accentColor="border-emerald-500" nextStatus="COMPLETED" nextLabel="Átvették (Lezárás)" NextIcon={Check} />)}
            {readyOrders.length === 0 && <p className="text-center text-slate-400 font-medium py-8 italic">Nincs átvételre váró rendelés</p>}
          </div>
        </div>
      </div>

      {/* --- TÖRLÉSI MODAL (Intelligens Logikával) --- */}
      {cancelOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">

            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-500" />
                Rendelés Törlése
              </h2>
              <button onClick={closeCancelModal} className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-full shadow-sm hover:shadow transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {cancelOrder.status !== 'NEW' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900">Szigorított Törlés</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Ez a rendelés már készítés alatt van vagy elkészült. A törléshez kötelező indoklást írni, és műszakvezetői jóváhagyás szükséges.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Törlés Indoka {cancelOrder.status !== 'NEW' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Pl.: Vásárló nem kérte / Nincs elég alapanyag"
                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none h-24"
                  />
                </div>

                {cancelOrder.status !== 'NEW' && user?.role !== 'ADMIN' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Műszakvezetői Kód (Admin Code) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="••••"
                      className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-center tracking-[0.5em] font-bold text-xl"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={closeCancelModal}
                className="px-5 py-2.5 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 bg-slate-100 rounded-xl transition-all"
              >
                Vissza
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={updateStatusMutation.isPending}
                className="px-5 py-2.5 font-bold text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg disabled:opacity-50 rounded-xl transition-all flex items-center gap-2"
              >
                {updateStatusMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Végleges Törlés'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}