import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { Users as UsersIcon, Shield, ShieldCheck, User as UserIcon, Loader2, Search, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string; fullName: string; email: string; role: 'ADMIN' | 'BARTENDER' | 'CUSTOMER'; createdAt: string;
}

const rolePriority: Record<string, number> = {
  'ADMIN': 1,
  'BARTENDER': 2,
  'CUSTOMER': 3
};

export default function Users() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/auth/users')).data,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => api.patch(`/auth/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Szerepkör frissítve!');
    },
    onError: () => toast.error('Hiba történt a módosításkor')
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    if (userId === currentUser?.id) return toast.error('Magadat nem fokozhatod le!');
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  const sortedAndFilteredUsers = users
    ?.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
            <UsersIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Felhasználók</h1>
            <p className="text-slate-500 font-medium mt-1">Jogosultságok kezelése (Admin {">"} Pultos {">"} Vásárló)</p>
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text" placeholder="Keresés..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-5 font-bold text-slate-400 uppercase text-xs tracking-wider">Felhasználó</th>
              <th className="p-5 font-bold text-slate-400 uppercase text-xs tracking-wider">Kapcsolat</th>
              <th className="p-5 font-bold text-slate-400 uppercase text-xs tracking-wider text-right">Művelet / Rang</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
            {sortedAndFilteredUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${
                      user.role === 'ADMIN' ? 'bg-red-500 text-white' :
                        user.role === 'BARTENDER' ? 'bg-amber-500 text-white' :
                          'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role === 'ADMIN' ? <ShieldCheck className="w-5 h-5" /> :
                        user.role === 'BARTENDER' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {user.role === 'ADMIN' ? 'Műszakvezető' : user.role === 'BARTENDER' ? 'Pultos' : 'Vásárló'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <Mail className="w-4 h-4 text-slate-300" /> {user.email}
                  </div>
                </td>
                <td className="p-5 text-right">
                  <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {(['CUSTOMER', 'BARTENDER', 'ADMIN'] as const).map((r) => (
                      <button
                        key={r}
                        disabled={user.id === currentUser?.id || updateRoleMutation.isPending}
                        onClick={() => handleRoleChange(user.id, r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          user.role === r
                            ? (r === 'ADMIN' ? 'bg-red-500 text-white shadow-md' : r === 'BARTENDER' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-900 shadow-md')
                            : 'text-slate-400 hover:text-slate-600'
                        } disabled:opacity-50`}
                      >
                        {r === 'ADMIN' ? 'Admin' : r === 'BARTENDER' ? 'Pultos' : 'Vásárló'}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}