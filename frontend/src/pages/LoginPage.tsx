import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Mail, Lock, Loader2, Utensils } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Kérlek, adj meg egy érvényes e-mail címet!"),
  password: z.string().min(1, "A jelszó megadása kötelező!"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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

      toast.success(`Üdvözlünk újra, ${user.fullName.split(' ')[0]}! 👋`);

      if (user.role === "ADMIN") navigate("/admin-orders");
      else if (user.role === "BARTENDER") navigate("/bart-orders");
      else navigate("/order");

    } catch (error: any) {
      toast.error(error.response?.data?.error || "Helytelen e-mail cím vagy jelszó!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in zoom-in-95 duration-500 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 space-y-8 relative overflow-hidden">

        {/* Dekorációs háttér elem */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-3 relative z-10">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6 text-white transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Utensils className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Üdvözlünk <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">újra!</span>
          </h1>
          <p className="text-slate-500 font-medium">Jelentkezz be a finomságokért</p>
        </div>

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                {...register("email")}
                disabled={isSubmitting}
                type="email"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-500/20'} rounded-2xl focus:ring-4 outline-none transition-all disabled:opacity-50 font-medium text-slate-900 placeholder:text-slate-400`}
                placeholder="E-mail címed"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1 ml-2 font-bold animate-in slide-in-from-top-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                {...register("password")}
                disabled={isSubmitting}
                type="password"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border ${errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-amber-500 focus:ring-amber-500/20'} rounded-2xl focus:ring-4 outline-none transition-all disabled:opacity-50 font-medium text-slate-900 placeholder:text-slate-400`}
                placeholder="Jelszavad"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1 ml-2 font-bold animate-in slide-in-from-top-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-amber-500/25 transition-all duration-300 active:scale-[0.98] mt-4"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Bejelentkezés...</>
            ) : (
              <><LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Bejelentkezés</>
            )}
          </button>
        </form>

        <div className="relative py-2 z-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-black">
            <span className="bg-white px-4 text-slate-400">Vagy</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full bg-transparent border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:border-amber-500 hover:text-amber-600 transition-all duration-300 relative z-10"
        >
          <UserPlus className="w-5 h-5" /> Fiók létrehozása
        </button>
      </div>
    </div>
  );
}