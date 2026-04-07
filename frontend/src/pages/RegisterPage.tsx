import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const registerSchema = z.object({
  fullName: z.string().min(2, "A név megadása kötelező!"),
  email: z.email("Érvénytelen e-mail cím!"),
  password: z.string().min(6, "A jelszónak legalább 6 karakternek kell lennie!"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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
      const { user, accessToken} = response.data;

      setAuth(user, accessToken);
      toast.success("Sikeres regisztráció! Üdvözlünk a rendszerben!");
      navigate("/order");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Ezzel az e-mail címmel már regisztráltak!");
      } else {
        toast.error(error.response?.data?.error || "Váratlan hiba történt a regisztráció során.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">

        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-gray-400 hover:text-amber-500 transition-colors text-sm font-medium hover:cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Vissza a belépéshez
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Fiók <span className="text-amber-500">létrehozása</span>
          </h1>
          <p className="text-gray-500">
            Csatlakozz hozzánk és rendelj egyszerűen!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                {...register("fullName")}
                disabled={isSubmitting}
                type="text"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-amber-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                placeholder="Teljes név"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.fullName.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                {...register("email")}
                disabled={isSubmitting}
                type="email"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-amber-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all disabled:opacity-50`}
                placeholder="E-mail cím"
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
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all mt-4 hover:cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mentés folyamatban...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> Regisztráció
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 px-4">
          A regisztrációval elfogadod a felhasználási feltételeket és az
          adatkezelési szabályzatot.
        </p>
      </div>
    </div>
  );
}