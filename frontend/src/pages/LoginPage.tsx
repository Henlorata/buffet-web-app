import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data;

      setAuth(user, accessToken, refreshToken);
      toast.success("Sikeres bejelentkezés!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Sikertelen bejelentkezés!", {position: "top-center"});
    } finally {
      setLoading(false);
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

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              required
              disabled={loading}
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              placeholder="Email cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              required
              disabled={loading}
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
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
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-amber-500 text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-all cursor-pointer disabled:opacity-50"
        >
          <UserPlus className="w-5 h-5" /> Regisztráció
        </button>
      </div>
      
      <Toaster toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex items-center w-full gap-2 p-4 rounded-md bg-red-600/75 text-white border border-red-800 shadow-2xl",
          title: "text-sm font-medium",
          icon: "text-amber-500",
        },
      }}/>
    </div>
  );
}