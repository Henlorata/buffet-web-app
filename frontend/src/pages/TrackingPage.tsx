import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { Loader2, CheckCircle2, Clock, ChefHat, PartyPopper, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function TrackingPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    refetchInterval: 3000,
  });

  const order = orders?.find((o: any) => o.id === id);

  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/orders/${id}/status`, { status: 'CANCELLED' });
    },
    onSuccess: () => {
      toast.success(t('tracking.toastCancelSuccess'));
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">{t('tracking.loading')}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <XCircle className="w-16 h-16 text-red-400 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 mb-4">{t('tracking.notFound')}</h2>
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" /> {t('tracking.backToOrders')}
        </button>
      </div>
    );
  }

  const steps = [
    { status: 'NEW', title: t('tracking.statusNewTitle'), subtitle: t('tracking.statusNewDesc'), icon: Clock },
    { status: 'PREPARING', title: t('tracking.statusPrepTitle'), subtitle: t('tracking.statusPrepDesc'), icon: ChefHat },
    { status: 'READY', title: t('tracking.statusReadyTitle'), subtitle: t('tracking.statusReadyDesc'), icon: PartyPopper },
    { status: 'COMPLETED', title: t('tracking.statusCompTitle'), subtitle: t('tracking.statusCompDesc'), icon: CheckCircle2 }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('tracking.backToOrders')}
        </button>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="text-center mb-12 relative z-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">{t('tracking.title')}</h1>
            <p className="text-slate-500 font-medium">
              {t('tracking.orderNumber')} <span className="text-slate-900 font-black px-2 py-1 bg-slate-100 rounded-lg">#{order.id.slice(-6).toUpperCase()}</span>
            </p>
          </div>

          {isCancelled ? (
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 text-center relative z-10">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-red-700 mb-2">{t('tracking.cancelledTitle')}</h2>
              <p className="text-red-500/80 font-medium">{t('tracking.cancelledDesc')}</p>
            </div>
          ) : (
            <div className="relative z-10 pl-4 md:pl-8">
              <div className="absolute left-[39px] md:left-[55px] top-8 bottom-8 w-1 bg-slate-100 rounded-full" />
              <div
                className="absolute left-[39px] md:left-[55px] top-8 w-1 bg-amber-500 rounded-full transition-all duration-1000 ease-in-out"
                style={{ height: `${Math.max(0, currentStepIndex * 33.33)}%` }}
              />

              <div className="space-y-12">
                {steps.map((step, index) => {
                  const isPassed = currentStepIndex > index;
                  const isActive = currentStepIndex === index;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="relative flex items-center gap-6 md:gap-8 group">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative z-10 transition-all duration-500 ${isActive ? 'bg-amber-500 text-white scale-110 shadow-amber-500/30' : isPassed ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                        {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-7 h-7" />}
                      </div>

                      <div className="flex-1">
                        <h3 className={`text-xl font-black transition-colors ${isActive ? 'text-amber-500' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h3>
                        <p className={`font-medium transition-colors mt-1 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.status === 'NEW' && !isCancelled && (
            <div className="mt-16 pt-8 border-t border-slate-100 text-center relative z-10">
              <button
                onClick={() => cancelOrderMutation.mutate()}
                disabled={cancelOrderMutation.isPending}
                className="text-slate-400 hover:text-red-500 font-bold transition-colors underline underline-offset-4 flex items-center justify-center gap-2 mx-auto"
              >
                {cancelOrderMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('tracking.cancelling')}</> : t('tracking.cancelOrder')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}