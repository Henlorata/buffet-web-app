import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Lock, Shield, Loader2, Save, KeyRound } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useMemo, useEffect } from "react";

const getProfileSchema = (t: any) => z.object({
  fullName: z.string().min(2, t("profile.nameError")),
  email: z.string().email(t("profile.emailError")),
});

const getPasswordSchema = (t: any) => z.object({
  currentPassword: z.string().min(1, t("profile.currentPasswordReq")),
  newPassword: z.string().min(6, t("profile.newPasswordReq")),
  confirmPassword: z.string().min(1, t("profile.confirmPasswordReq")),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t("profile.passwordMismatch"),
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<ReturnType<typeof getProfileSchema>>;
type PasswordForm = z.infer<ReturnType<typeof getPasswordSchema>>;

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const profileSchema = useMemo(() => getProfileSchema(t), [t]);
  const passwordSchema = useMemo(() => getPasswordSchema(t), [t]);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    }
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema)
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => api.patch('/auth/profile', data),
    onSuccess: (response) => {
      const token = useAuthStore.getState().accessToken;
      if (token && response.data.user) {
        setAuth(response.data.user, token);
      }
      toast.success(t("profile.profileUpdated"));
    },
    onError: (error: any) => {
      toast.error(t("profile.profileUpdateError", { error: error.response?.data?.error || "Unknown error" }));
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => api.patch('/auth/password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }),
    onSuccess: () => {
      passwordForm.reset();
      toast.success(t("profile.passwordUpdated"));
    },
    onError: (error: any) => {
      toast.error(t("profile.passwordUpdateError", { error: error.response?.data?.error || "Unknown error" }));
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-lg shadow-slate-900/20 relative z-10">
            <UserIcon className="w-10 h-10 text-amber-500" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-900">{t("profile.title")}</h1>
            <p className="text-slate-500 font-medium">{t("profile.subtitle")}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profil infó forma */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">{t("profile.basicInfo")}</h2>
            </div>

            <form onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("profile.nameLabel")}</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...profileForm.register("fullName")}
                    type="text"
                    className={`w-full bg-slate-50 border ${profileForm.formState.errors.fullName ? 'border-red-400' : 'border-slate-200'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 focus:ring-amber-500/20 font-medium transition-all`}
                  />
                </div>
                {profileForm.formState.errors.fullName && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{profileForm.formState.errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("profile.emailLabel")}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...profileForm.register("email")}
                    type="email"
                    className={`w-full bg-slate-50 border ${profileForm.formState.errors.email ? 'border-red-400' : 'border-slate-200'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 focus:ring-amber-500/20 font-medium transition-all`}
                  />
                </div>
                {profileForm.formState.errors.email && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{profileForm.formState.errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending || !profileForm.formState.isDirty}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 disabled:bg-slate-300 disabled:hover:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-4 group"
              >
                {updateProfileMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                {updateProfileMutation.isPending ? t("profile.savingBtn") : t("profile.saveBtn")}
              </button>
            </form>
          </div>

          {/* Jelszó forma */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <KeyRound className="w-6 h-6 text-slate-900" />
              <h2 className="text-xl font-bold text-slate-900">{t("profile.passwordSection")}</h2>
            </div>

            <form onSubmit={passwordForm.handleSubmit((data) => updatePasswordMutation.mutate(data))} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("profile.currentPasswordLabel")}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...passwordForm.register("currentPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border ${passwordForm.formState.errors.currentPassword ? 'border-red-400' : 'border-slate-200'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-slate-900 focus:ring-slate-900/10 font-medium transition-all`}
                  />
                </div>
                {passwordForm.formState.errors.currentPassword && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("profile.newPasswordLabel")}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    {...passwordForm.register("newPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border ${passwordForm.formState.errors.newPassword ? 'border-red-400' : 'border-slate-200'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 focus:ring-amber-500/20 font-medium transition-all`}
                  />
                </div>
                {passwordForm.formState.errors.newPassword && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{passwordForm.formState.errors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("profile.confirmPasswordLabel")}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <input
                    {...passwordForm.register("confirmPassword")}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-slate-50 border ${passwordForm.formState.errors.confirmPassword ? 'border-red-400' : 'border-slate-200'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 focus:ring-amber-500/20 font-medium transition-all`}
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{passwordForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={updatePasswordMutation.isPending || !passwordForm.formState.isDirty}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95 mt-4"
              >
                {updatePasswordMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                {updatePasswordMutation.isPending ? t("profile.savingBtn") : t("profile.changePasswordBtn")}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}