import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Lock, Shield, Loader2, Save, KeyRound } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, "A név legalább 2 karakter hosszú kell legyen!"),
  email: z.string().email("Érvénytelen e-mail cím!"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "A jelenlegi jelszavad megadása kötelező!"),
  newPassword: z.string().min(6, "Az új jelszónak legalább 6 karakternek kell lennie!"),
  confirmPassword: z.string().min(1, "A jelszó megerősítése kötelező!"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "A két jelszó nem egyezik!",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, accessToken, setAuth } = useAuthStore();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    }
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => (await api.put('/auth/profile', data)).data,
    onSuccess: (data) => {
      if (accessToken) setAuth(data.user, accessToken);
      toast.success('Személyes adatok sikeresen frissítve!');
    },
    onError: (error: any) => toast.error(error.response?.data?.error || 'Hiba a profil frissítésekor!')
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => (await api.put('/auth/password', { currentPassword: data.currentPassword, newPassword: data.newPassword })).data,
    onSuccess: () => {
      toast.success('A jelszavadat sikeresen megváltoztattuk!');
      passwordForm.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.error || 'Hiba a jelszó módosításakor!')
  });

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 animate-in fade-in duration-500">

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 text-white">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Saját Profil</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            Fiókadatok és biztonság
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
              user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                user.role === 'BARTENDER' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {user.role === 'ADMIN' ? 'Műszakvezető' : user.role === 'BARTENDER' ? 'Pultos' : 'Vásárló'}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-black text-slate-800">Személyes Adatok</h2>
          </div>

          <form onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Teljes Név</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  {...profileForm.register("fullName")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
              {profileForm.formState.errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold">{profileForm.formState.errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail cím</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  {...profileForm.register("email")}
                  type="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
              {profileForm.formState.errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{profileForm.formState.errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending || !profileForm.formState.isDirty}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 mt-4"
            >
              {updateProfileMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Adatok mentése
            </button>
          </form>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-black text-slate-800">Jelszó Módosítása</h2>
          </div>

          <form onSubmit={passwordForm.handleSubmit((data) => updatePasswordMutation.mutate(data))} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Jelenlegi jelszó</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  {...passwordForm.register("currentPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 font-medium"
                />
              </div>
              {passwordForm.formState.errors.currentPassword && <p className="text-red-500 text-xs mt-1 font-bold">{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-1">Új jelszó</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-amber-500" />
                <input
                  {...passwordForm.register("newPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
              {passwordForm.formState.errors.newPassword && <p className="text-red-500 text-xs mt-1 font-bold">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Új jelszó megerősítése</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-amber-500" />
                <input
                  {...passwordForm.register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
              {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={updatePasswordMutation.isPending || !passwordForm.formState.isDirty}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 font-bold py-3.5 rounded-xl transition-all active:scale-95 mt-4"
            >
              {updatePasswordMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              Jelszó frissítése
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}