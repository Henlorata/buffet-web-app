import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;

      setAuth(user, accessToken);
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.error || "Sikertelen bejelentkezés!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-amber-500 gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-gray-600 font-medium animate-pulse">
            Oldal betöltése...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Üdvözlünk <span className="text-amber-500">újra!</span>
            </h1>
            <p className="text-gray-500">Jelentkezz be a folytatáshoz</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                required
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                required
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 hover:cursor-pointer"
            >
              <LogIn className="w-5 h-5" /> Bejelentkezés
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Vagy</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-amber-500 text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-all hover:cursor-pointer"
          >
            <UserPlus className="w-5 h-5" /> Regisztráció
          </button>
        </div>
      )}
    </div>
  );
}
