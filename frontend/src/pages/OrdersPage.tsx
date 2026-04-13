import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { ShoppingBag, Loader2, PackageX, Clock, ChefHat, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, ArrowRight, ReceiptText, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';

interface OrderItem {
  id: string;
  quantity: number;
  unitPriceAtPurchase: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: number;
    isActive: boolean;
    stockQuantity: number;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
  cancellationReason?: string;
  cancelledBy?: { fullName: string };
}

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
  });

  useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.patch(`/orders/${orderId}/status`, { status: 'CANCELLED' });
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('orders.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || t('orders.deleteError'));
    }
  });

  const handleReorder = (items: OrderItem[]) => {
    let successCount = 0;
    let failCount = 0;

    items.forEach((item) => {
      if (item.product.isActive && item.product.stockQuantity >= item.quantity) {
        addItem(item.product as any, item.quantity);
        successCount++;
      } else {
        failCount++;
      }
    });

    if (successCount > 0) {
      toast.success(t('product.added_to_cart_multiple', { count: successCount }));
      navigate('/order');
    }
    if (failCount > 0) {
      toast.warning(t('cart.notEnoughStock'));
    }
  };

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'NEW': return { label: t('orders.statusNew'), color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock className="w-4 h-4" /> };
      case 'PREPARING': return { label: t('orders.statusPrep'), color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <ChefHat className="w-4 h-4" /> };
      case 'READY': return { label: t('orders.statusReady'), color: 'bg-green-500 text-white border-green-600 animate-pulse', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'COMPLETED': return { label: t('orders.statusComp'), color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'CANCELLED': return { label: t('orders.statusCanc'), color: 'bg-red-50 text-red-600 border-red-100', icon: <XCircle className="w-4 h-4" /> };
      default: return { label: t('orders.statusUnknown'), color: 'bg-gray-100 text-gray-600', icon: <AlertCircle className="w-4 h-4" /> };
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-amber-500 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-slate-500 font-bold">{t('orders.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 space-y-4">
        <AlertCircle className="w-16 h-16" />
        <h2 className="text-2xl font-black text-slate-900">{t('orders.errorTitle')}</h2>
        <p className="text-slate-500 font-medium">{t('orders.errorDesc')}</p>
      </div>
    );
  }

  const activeOrders = orders?.filter(o => ['NEW', 'PREPARING', 'READY'].includes(o.status)) || [];
  const pastOrders = orders?.filter(o => ['COMPLETED', 'CANCELLED'].includes(o.status)) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pt-4 pb-12">

      <div className="flex items-center gap-3">
        <div className="bg-amber-500 text-white p-3 rounded-2xl shadow-lg shadow-amber-500/20">
          <ReceiptText className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('orders.title')}</h1>
          <p className="text-slate-500 font-medium mt-1">{t('orders.subtitle')}</p>
        </div>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center shadow-xl shadow-slate-200/20 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <PackageX className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">{t('orders.emptyTitle')}</h3>
          <p className="text-slate-500 mb-8 max-w-md font-medium">{t('orders.emptyDesc')}</p>
          <button onClick={() => navigate('/order')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95">
            {t('orders.toMenuBtn')}
          </button>
        </div>
      ) : (
        <>
          {activeOrders.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span> {t('orders.inProgress')}
              </h2>
              <div className="grid gap-6">
                {activeOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <div key={order.id} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/40 border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('orders.idLabel')} <span className="text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 ml-1">#{order.id.split('-')[0]}</span></p>
                          <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black border ${statusConfig.color} shadow-sm`}>
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>

                      <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex -space-x-4">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={item.id} className={`w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-slate-100 flex items-center justify-center z-[${3-i}] relative shadow-sm`}>
                              {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 text-slate-400" />}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center z-0 relative shadow-sm text-xs font-bold text-slate-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <p className="font-black text-2xl text-slate-900 hidden sm:block">{order.totalAmount} {t('orders.currency')}</p>
                          <button
                            onClick={() => navigate(`/tracking/${order.id}`)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                          >
                            {t('orders.liveTracking')} <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pastOrders.length > 0 && (
            <div className="space-y-4 pt-8 border-t-2 border-slate-100 border-dashed">
              <h2 className="text-xl font-black text-slate-900 mb-4">{t('orders.pastOrders')}</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {pastOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const statusConfig = getStatusConfig(order.status);

                  return (
                    <div key={order.id} className={`border-b border-slate-100 last:border-0 transition-colors ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4 text-left"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className={`p-3 rounded-full ${order.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'}`}>
                            {order.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                              {formatDate(order.createdAt)}
                              <span className="text-xs text-slate-400 font-mono font-medium">#{order.id.split('-')[0]}</span>
                            </p>
                            <p className={`text-sm font-bold ${order.status === 'COMPLETED' ? 'text-slate-500' : 'text-red-500'}`}>
                              {statusConfig.label}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 pl-14 sm:pl-0">
                          <span className="font-black text-lg text-slate-900">{order.totalAmount} {t('orders.currency')}</span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-6 pt-2 pl-6 sm:pl-20">
                          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                            {order.status === 'CANCELLED' && (
                              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-xs font-black text-red-400 uppercase tracking-widest">{t('orders.cancelData')}</p>
                                <p className="text-sm text-red-700 font-bold mt-1">
                                  {t('orders.reasonLabel')} <span className="font-normal italic">{order.cancellationReason || t('orders.noReason')}</span>
                                </p>
                                <p className="text-[10px] text-red-400 mt-1">
                                  {t('orders.cancelledByLabel')} {order.cancelledBy?.fullName || t('orders.customer')}
                                </p>
                              </div>
                            )}
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-2">{t('orders.orderItems')}</h4>
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{item.quantity}x</span>
                                  <span className="font-bold text-slate-700">{item.product.name}</span>
                                </div>
                                <span className="font-bold text-slate-400">{item.unitPriceAtPurchase * item.quantity} {t('orders.currency')}</span>
                              </div>
                            ))}
                            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
                              <button
                                onClick={() => handleReorder(order.items)}
                                className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
                              >
                                <RefreshCcw className="w-4 h-4" /> {t('cart.reorder')}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}