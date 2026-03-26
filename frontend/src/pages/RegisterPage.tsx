import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", { formData });
      const { user, accessToken } = response.data;

      setAuth(user, accessToken);
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.error || "Sikertelen regisztráció!");
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
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-400 hover:text-amber-500 transition-colors text-sm font-medium hover:cursor-pointer"
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                required
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Teljes név"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                required
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="E-mail cím"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                required
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Jelszó"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all mt-4 hover:cursor-pointer"
            >
              <UserPlus className="w-5 h-5" /> Regisztráció
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 px-4">
            A regisztrációval elfogadod a felhasználási feltételeket és az
            adatkezelési szabályzatot.
          </p>
        </div>
      )}
    </div>
  );
}
