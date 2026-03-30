import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.email("Kérlek, adj meg egy érvényes e-mail címet!"),
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
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken, refreshToken);
      toast.success("Sikeres bejelentkezés!");
      navigate("/order");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Helytelen e-mail cím vagy jelszó!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Üdvözlünk <span className="text-amber-500">újra!</span>
          </h1>
          <p className="text-gray-500">Jelentkezz be a folytatáshoz</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                {...register("email")}
                disabled={isSubmitting}
                type="email"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-amber-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                placeholder="Email cím"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                {...register("password")}
                disabled={isSubmitting}
                type="password"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-amber-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                placeholder="Jelszó"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Ellenőrzés...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Bejelentkezés
              </>
            )}
          </button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-medium">Vagy</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-amber-500 text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-all cursor-pointer disabled:opacity-50"
        >
          <UserPlus className="w-5 h-5" /> Regisztráció
        </button>
      </div>
    </div>
  );
}