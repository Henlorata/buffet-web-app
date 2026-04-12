import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { Loader2, CheckCircle2, Clock, ChefHat, PartyPopper, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function TrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    refetchInterval: 3000, // 3 sec
  });

  const order = orders?.find((o: any) => o.id === id);

  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/orders/${id}/status`, { status: 'CANCELLED' });
    },
    onSuccess: () => {
      toast.success('Rendelés törölve.');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black text-slate-800">Rendelés nem található</h1>
        <button onClick={() => navigate('/orders')} className="mt-4 text-amber-500 font-bold hover:underline">Vissza a rendeléseimhez</button>
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const steps = [
    { status: 'NEW', title: 'Rendelés leadva', subtitle: 'Várjuk, hogy a pultos elfogadja', icon: Clock },
    { status: 'PREPARING', title: 'Készül a finomság', subtitle: 'A pultos már dolgozik rajta', icon: ChefHat },
    { status: 'READY', title: 'Átvehető!', subtitle: 'Gyere a pulthoz és mondd be a neved', icon: PartyPopper },
  ];

  const currentStepIndex = order.status === 'COMPLETED' ? 3 : steps.findIndex(s => s.status === order.status);

  return (
    <div className="max-w-3xl mx-auto min-h-[80vh] pt-4 animate-in fade-in duration-500">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Vissza a listához
      </button>

      {isCancelled ? (
        <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-12 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-900 mb-2">Rendelés Törölve</h1>
          <p className="text-slate-600 font-medium text-lg">Ezt a rendelést sikeresen lemondtad.</p>
        </div>
      ) : order.status === 'COMPLETED' ? (
        <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-12 text-center">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-900 mb-2">Jó étvágyat!</h1>
          <p className="text-slate-600 font-medium text-lg">A rendelést átvetted. Reméljük ízleni fog!</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 overflow-hidden relative">

          <div className="text-center mb-12">
            <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Élő Követés</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">Rendelés #{order.id.split('-')[0]}</h1>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 md:-translate-x-1/2 rounded-full"></div>

            <div
              className="absolute left-8 md:left-1/2 top-0 w-1 bg-amber-500 md:-translate-x-1/2 rounded-full transition-all duration-1000 ease-in-out"
              style={{ height: currentStepIndex === 0 ? '15%' : currentStepIndex === 1 ? '50%' : '100%' }}
            ></div>

            <div className="space-y-12 relative">
              {steps.map((step, index) => {
                const isActive = currentStepIndex === index;
                const isPassed = currentStepIndex > index;
                const Icon = step.icon;

                return (
                  <div key={step.status} className={`flex flex-row md:justify-center items-center gap-6 relative ${isPassed || isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>

                    <div className="hidden md:block flex-1 text-right pr-8">
                      {isActive && <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black animate-pulse">Jelenlegi állapot</span>}
                    </div>

                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative z-10 transition-colors duration-500 ${isActive ? 'bg-amber-500 text-white animate-bounce' : isPassed ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                      {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                    </div>

                    <div className="flex-1 md:pl-8">
                      <h3 className={`text-xl font-black ${isActive ? 'text-amber-600' : 'text-slate-900'}`}>{step.title}</h3>
                      <p className="text-slate-500 font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.status === 'NEW' && (
            <div className="mt-16 pt-8 border-t border-slate-100 text-center">
              <button
                onClick={() => cancelOrderMutation.mutate()}
                disabled={cancelOrderMutation.isPending}
                className="text-slate-400 hover:text-red-500 font-bold transition-colors underline underline-offset-4"
              >
                {cancelOrderMutation.isPending ? 'Törlés folyamatban...' : 'Meggondoltam magam, mégsem kérem'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}