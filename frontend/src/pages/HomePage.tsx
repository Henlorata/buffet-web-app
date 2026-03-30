import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in duration-500">

      {/* Hero Section */}
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Friss. Gyors. <span className="text-amber-500">Finom.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Kerüld el a sorban állást! Rendezd le a rendelésed online, és vedd át frissen, amikor elkészült. A legjobb szendvicsek és kávék egy gombnyomásra.
        </p>
        <div className="pt-4">
          <Link
            to="/order"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Menü megtekintése <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl pt-12 border-t border-gray-100">
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Gyors átvétel</h3>
          <p className="text-gray-500 text-sm">Élőben követheted a rendelésed állapotát, így pont időben érkezel.</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Prémium Minőség</h3>
          <p className="text-gray-500 text-sm">Helyben készült, friss alapanyagokból dolgozunk minden nap.</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Biztonságos Fizetés</h3>
          <p className="text-gray-500 text-sm">Készpénzmentes, gyors és biztonságos online tranzakciók.</p>
        </div>
      </div>
    </div>
  );
}