import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { Users as UsersIcon, Shield, ShieldCheck, User as UserIcon, Loader2, Search, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'BARTENDER' | 'CUSTOMER';
  createdAt: string;
}

const rolePriority: Record<string, number> = {
  'ADMIN': 1,
  'BARTENDER': 2,
  'CUSTOMER': 3
};

export default function Users() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/auth/users');
      return res.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => api.patch(`/auth/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t('users.toastRoleSuccess'));
    },
    onError: (error: any) => {
      toast.error(t('users.toastError', { error: error.response?.data?.error || "Unknown error" }));
    }
  });

  const handleRoleChange = (id: string, role: string) => {
    updateRoleMutation.mutate({ id, role });
  };

  const filteredUsers = users?.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (rolePriority[a.role] !== rolePriority[b.role]) {
      return rolePriority[a.role] - rolePriority[b.role];
    }
    return a.fullName.localeCompare(b.fullName);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-bold text-red-500">
        {t('users.loadError')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <UsersIcon className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{t('users.title')}</h1>
              <p className="text-slate-500 font-medium">{t('users.subtitle', { count: users?.length || 0 })}</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t('users.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 font-bold text-slate-500 uppercase text-xs tracking-wider">{t('users.nameCol')}</th>
                <th className="p-5 font-bold text-slate-500 uppercase text-xs tracking-wider">{t('users.emailCol')}</th>
                <th className="p-5 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">{t('users.roleCol')}</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
              {filteredUsers?.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                          u.role === 'BARTENDER' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role === 'ADMIN' ? <ShieldCheck className="w-5 h-5" /> :
                          u.role === 'BARTENDER' ? <Shield className="w-5 h-5" /> :
                            <UserIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{u.fullName}</p>
                        {u.id === currentUser?.id && <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-md mt-1 inline-block">{t('users.you')}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Mail className="w-4 h-4 text-slate-400" /> {u.email}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="inline-flex items-center p-1.5 bg-slate-100 rounded-xl border border-slate-200/60">
                      {(['CUSTOMER', 'BARTENDER', 'ADMIN'] as const).map((r) => (
                        <button
                          key={r}
                          disabled={u.id === currentUser?.id || updateRoleMutation.isPending}
                          onClick={() => handleRoleChange(u.id, r)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            u.role === r
                              ? (r === 'ADMIN' ? 'bg-red-500 text-white shadow-md' : r === 'BARTENDER' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-900 shadow-md')
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                          } disabled:opacity-50`}
                        >
                          {r === 'ADMIN' ? t('users.roleAdmin') : r === 'BARTENDER' ? t('users.roleBartender') : t('users.roleCustomer')}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          {filteredUsers?.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              {t('users.noUsersFound')}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}