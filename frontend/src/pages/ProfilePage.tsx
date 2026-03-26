import { useEffect, useState } from "react";
import User from "@/interfaces/User_Interface";

const ViewProfilePage: React.FC = () => {
  const [profile /*setProfile*/] = useState<User>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    time: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
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
      alert("Profil sikeresen frissítve!");
    } catch (error) {
      alert("Hiba történt a mentés során.");
    }
  };

  const roleConfig: Record<string, any> = {
    V: {
      label: "Vásárló",
      headerColor: "from-blue-600 to-indigo-700",
      badgeColor: "bg-blue-50 text-blue-700",
      dotColor: "bg-blue-500",
    },
    A: {
      label: "Admin",
      headerColor: "from-amber-500 to-orange-600",
      badgeColor: "bg-amber-50 text-amber-700",
      dotColor: "bg-amber-500",
    },
    P: {
      label: "Pultos",
      headerColor: "from-emerald-500 to-teal-600",
      badgeColor: "bg-emerald-50 text-emerald-700",
      dotColor: "bg-emerald-500",
    },
  };

  if (!profile) return <div className="p-10 text-center">User not found.</div>;
  const config = roleConfig[profile.func] || roleConfig["V"];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="mb-8">
        <p className="text-gray-500 mt-2">
          Itt módosíthatod személyes adataidat.
        </p>
      </div>

      <div className="bg-white shadow-xl border border-gray-100 rounded-3xl overflow-hidden mb-10">
        <div className={`h-32 bg-gradient-to-r ${config.headerColor}`}></div>

        <div className="px-8 pb-10">
          <div className="relative flex justify-center">
            <div className="absolute -top-16">
              <img
                src={profile.img_url}
                alt={profile.name}
                className="h-32 w-32 rounded-3xl object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Teljes név
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                E-mail cím
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Fiók típusa
              </label>
              <div
                className={`flex items-center gap-2 border py-3 px-4 rounded-xl ${config.badgeColor}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`}
                ></span>
                <span className="font-bold text-sm uppercase">
                  {config.label}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Jelszó
              </label>
              <input
                id="password"
                type="password"
                className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Fiók létrejötte
              </label>
              <p
                id="time"
                className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                {new Date(formData.time).toLocaleDateString("hu-HU", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
            <button
              className="bg-gray-900 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all active:scale-95 cursor-pointer"
              onClick={handleSave}
            >
              Változtatások mentése
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
