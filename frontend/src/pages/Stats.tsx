import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { Loader2, TrendingUp, DollarSign, ShoppingBag, Calendar, PieChart as PieIcon, Trophy, AlertCircle } from 'lucide-react';

export default function Stats() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/orders/stats')).data,
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  if (isError) return <div className="text-center p-20 text-red-500"><AlertCircle className="mx-auto w-12 h-12 mb-4" /> Hiba az adatok betöltésekor.</div>;

  const maxRevenue = Math.max(...(stats?.weeklyChart.map((d: any) => d.revenue) || [1]));

  const completed = stats?.statusBreakdown.find((s: any) => s.status === 'COMPLETED')?.count || 0;
  const cancelled = stats?.statusBreakdown.find((s: any) => s.status === 'CANCELLED')?.count || 0;
  const totalForPie = completed + cancelled || 1;
  const cancelledRatio = (cancelled / totalForPie) * 100;

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12 animate-in fade-in duration-500 px-4">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Vállalati Statisztikák</h1>
          <p className="text-slate-500 font-medium mt-1">Élő adatok az üzletmenetről</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
          <DollarSign className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform" />
          <p className="text-slate-400 font-bold mb-2">Összbevétel (Befejezett)</p>
          <h2 className="text-4xl font-black text-emerald-400">
            {stats?.totalRevenue.toLocaleString('hu-HU')} Ft
          </h2>
        </div>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm group">
          <ShoppingBag className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50" />
          <p className="text-slate-500 font-bold mb-2">Összes Rendelés</p>
          <h2 className="text-4xl font-black text-slate-800">{stats?.totalOrders} db</h2>
        </div>
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
          <p className="text-slate-500 font-bold mb-2">Rendelés Teljesítés</p>
          <h2 className="text-4xl font-black text-blue-600">{Math.round((completed/totalForPie)*100)}%</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Calendar className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-black text-slate-800">Heti Bevétel</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-48 mt-auto px-2">
            {stats?.weeklyChart.map((day: any) => {
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={day.date} className="flex flex-col items-center flex-1 group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl z-10 whitespace-nowrap">
                    {day.revenue.toLocaleString()} Ft
                  </div>
                  <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className="w-full bg-amber-500 rounded-t-lg transition-all duration-700"
                      style={{ height: `${height}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                    />
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase">
                    {new Intl.DateTimeFormat('hu-HU', { weekday: 'short' }).format(new Date(day.date))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <PieIcon className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-black text-slate-800">Lemondási Arány</h3>
          </div>
          <div className="flex items-center justify-around h-48">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="24" />
                <circle
                  cx="64" cy="64" r="50" fill="transparent" stroke="#ef4444" strokeWidth="24"
                  strokeDasharray={`${cancelledRatio * 3.14}, 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800">
                {Math.round(cancelledRatio)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-sm font-bold text-slate-600">Sikeres: {completed}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-bold text-slate-600">Törölt: {cancelled}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-black text-slate-800">Legnépszerűbb termékek</h3>
        </div>
        <div className="space-y-4">
          {stats?.popularProducts.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <span className="font-black text-slate-300 w-4">{i + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-slate-700">{p.name}</span>
                  <span className="font-black text-slate-900">{p.count} db</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(p.count / (stats.popularProducts[0]?.count || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}