import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const getRegisterSchema = (t: any) => z.object({
  fullName: z.string().min(2, t("register.nameError")),
  email: z.string().email(t("register.emailError")),
  password: z.string().min(6, t("register.passwordError")),
});

type RegisterForm = z.infer<ReturnType<typeof getRegisterSchema>>;

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const registerSchema = useMemo(() => getRegisterSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await api.post("/auth/register", data);
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);

      toast.success(t("register.successToast"));
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error(t("register.emailTaken"));
      } else {
        toast.error(t("register.error", { error: error.response?.data?.error || "Unknown error" }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8 relative z-10"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("register.backToLogin")}
        </button>

        <div className="mb-10 relative z-10">
          <h1 className="text-3xl font-black text-slate-900 mb-3">{t("register.title")}</h1>
          <p className="text-slate-500 font-medium">{t("register.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("register.nameLabel")}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("fullName")}
                type="text"
                placeholder={t("register.namePlaceholder")}
                className={`w-full bg-slate-50 border ${errors.fullName ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:ring-amber-500/20'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 font-medium transition-all`}
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("register.emailLabel")}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("email")}
                type="email"
                placeholder={t("register.emailPlaceholder")}
                className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:ring-amber-500/20'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 font-medium transition-all`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("register.passwordLabel")}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("password")}
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                className={`w-full bg-slate-50 border ${errors.password ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:ring-amber-500/20'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 font-medium transition-all`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 mt-8 group"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {t("register.registeringBtn")}</>
            ) : (
              <><UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> {t("register.registerBtn")}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}