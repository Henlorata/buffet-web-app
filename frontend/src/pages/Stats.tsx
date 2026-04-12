import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { Loader2, TrendingUp, DollarSign, ShoppingBag, Calendar } from 'lucide-react';

export default function Stats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/orders/stats')).data,
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  const maxRevenue = Math.max(...(stats?.weeklyChart.map((d: any) => d.revenue) || [1]));

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Statisztikák</h1>
          <p className="text-slate-500 font-medium mt-1">Bevételi adatok és rendelésszámok</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
          <DollarSign className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5" />
          <p className="text-slate-400 font-bold mb-2">Összes Bevétel (All-time)</p>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {stats?.totalRevenue.toLocaleString('hu-HU')} Ft
          </h2>
        </div>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 text-slate-900 shadow-sm relative overflow-hidden">
          <ShoppingBag className="absolute -right-6 -bottom-6 w-40 h-40 text-slate-50" />
          <p className="text-slate-500 font-bold mb-2">Sikeres Rendelések Száma</p>
          <h2 className="text-5xl font-black text-slate-800">
            {stats?.totalOrders} db
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <Calendar className="w-6 h-6 text-amber-500" />
          <h3 className="text-2xl font-black text-slate-800">Elmúlt 7 nap bevételei</h3>
        </div>

        <div className="flex items-end justify-between gap-2 h-64 mt-8">
          {stats?.weeklyChart.map((day: any) => {
            const heightPercent = (day.revenue / maxRevenue) * 100;
            const dateStr = new Intl.DateTimeFormat('hu-HU', { weekday: 'short' }).format(new Date(day.date));

            return (
              <div key={day.date} className="flex flex-col items-center flex-1 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {day.revenue.toLocaleString('hu-HU')} Ft
                  <br/><span className="text-slate-400 font-normal">{day.orders} rendelés</span>
                </div>

                <div className="w-full max-w-[4rem] bg-slate-100 rounded-t-xl relative overflow-hidden transition-all group-hover:bg-slate-200 h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-xl transition-all duration-1000 ease-out"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="mt-4 text-sm font-bold text-slate-500 uppercase">{dateStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}