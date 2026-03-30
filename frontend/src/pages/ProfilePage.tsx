import { User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Profil megtekintése</h2>
        <p className="text-gray-500 max-w-md">A profilod eléréséhez kérlek jelentkezz be a fiókodba.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900">Profilom</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-12 h-12" />
        </div>

        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              Szerepkör: {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-6 py-2.5 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors w-full md:w-auto mt-4 md:mt-0"
        >
          <LogOut className="w-5 h-5" />
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}