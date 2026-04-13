import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Mail, Lock, Loader2, Utensils } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const getLoginSchema = (t: any) => z.object({
  email: z.string().email(t("login.emailError")),
  password: z.string().min(1, t("login.passwordError")),
});

type LoginForm = z.infer<ReturnType<typeof getLoginSchema>>;

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginSchema = useMemo(() => getLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post("/auth/login", data);
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);

      toast.success(t("login.welcomeBack", { name: user.fullName }));
      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(t("login.invalidCredentials"));
      } else {
        toast.error(t("login.error", { error: error.response?.data?.error || "Unknown error" }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
            <Utensils className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">{t("login.title")}</h1>
          <p className="text-slate-500 font-medium px-4">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("login.emailLabel")}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("email")}
                type="email"
                placeholder={t("login.emailPlaceholder")}
                className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:ring-amber-500/20'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 font-medium transition-all`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{t("login.passwordLabel")}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("password")}
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                className={`w-full bg-slate-50 border ${errors.password ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:ring-amber-500/20'} rounded-2xl pl-11 pr-5 py-4 outline-none focus:ring-4 focus:border-amber-500 font-medium transition-all`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-2 font-bold">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-amber-500 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 mt-8 group"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {t("login.loggingInBtn")}</>
            ) : (
              <><LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> {t("login.loginBtn")}</>
            )}
          </button>
        </form>

        <div className="relative py-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-wider">
            <span className="bg-white px-4 text-slate-400">{t("login.or")}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          {t("login.registerLink")}
        </button>
      </div>
    </div>
  );
}