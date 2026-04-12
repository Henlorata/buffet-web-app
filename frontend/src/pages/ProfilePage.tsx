import React, { useEffect, useState } from "react";
import { api } from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { User} from "@/types/index";

const ViewProfilePage: React.FC = () => {
  const handleLogout = async () => {
    const { logout } = useAuthStore.getState();
    await api.post("/auth/logout");
    await logout();
  };

  const [profile, setProfile] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/me"); 
        const data = response.data;
        
        setProfile(data);
        setFormData({
          fullName: data.fullName,
          email: data.email,
          password: "",
        });
      } catch (error) {
        console.error("Hiba a betöltéskor:", error);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put("/auth/update", formData);
      toast.success("Profil sikeresen frissítve!");
    } catch (error) {
      toast.error("Hiba történt a mentés során.");
    }
  };

  const roleConfig: Record<string, any> = {
    USER: { label: "Vásárló", headerColor: "from-blue-600 to-indigo-700", badgeColor: "bg-blue-50 text-blue-700", dotColor: "bg-blue-500" },
    ADMIN: { label: "Admin", headerColor: "from-amber-500 to-orange-600", badgeColor: "bg-amber-50 text-amber-700", dotColor: "bg-amber-500" },
    BARTENDER: { label: "Pultos", headerColor: "from-emerald-500 to-teal-600", badgeColor: "bg-emerald-50 text-emerald-700", dotColor: "bg-emerald-500" },
  };

  if (!profile) return (
    <div className="p-10 text-center">
      <p className="mb-4">Munkamenet lejárt.</p>
    </div>
  );

  const config = roleConfig[profile.role] || roleConfig["USER"];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-xl border border-gray-100 rounded-3xl overflow-hidden mb-10">
        <div className={`h-32 bg-gradient-to-r ${config.headerColor}`}></div>
        <div className="px-8 pb-10">
          <div className="relative flex justify-center">
            <div className="absolute -top-16">
              <div className="h-32 w-32 rounded-3xl bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-gray-400">
                {profile.fullName.charAt(0)}
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Teljes név</label>
              <input id="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">E-mail cím</label>
              <input id="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Fiók típusa</label>
              <div className={`flex items-center gap-2 border py-3 px-4 rounded-xl ${config.badgeColor}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`}></span>
                <span className="font-bold text-sm uppercase">{config.label}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Regisztráció</label>
              <div className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl text-gray-500">
                {new Date(profile.createdAt).toLocaleDateString("hu-HU")}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Jelszó</label>
              <input id="password" type="password" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between gap-4">
             <button onClick={handleLogout} className="bg-red-500 hover:bg-red-800 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95 cursor-pointer">Kijelentkezés</button>
             <button onClick={() => toast.info("SÖTÉT!")} className="bg-gray-500 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95 cursor-pointer">🌜</button>
             <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95 cursor-pointer">Mentés</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;