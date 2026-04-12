import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Üzenet sikeresen elküldve! Hamarosan felvesszük veled a kapcsolatot.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-16 animate-in fade-in duration-500 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Lépj velünk kapcsolatba!</h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Kérdésed van a rendeléseddel kapcsolatban, vagy csak egy visszajelzést küldenél? Írj nekünk, és kollégáink hamarosan válaszolnak!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">

        <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem]">
          <h3 className="text-2xl font-black text-slate-800 mb-6">Elérhetőségeink</h3>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl"><MapPin className="w-6 h-6" /></div>
            <div>
              <p className="font-bold text-slate-900 text-lg">Címünk</p>
              <p className="text-slate-500 font-medium mt-1">9026 Győr,<br />Egyetem tér 1.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl"><Phone className="w-6 h-6" /></div>
            <div>
              <p className="font-bold text-slate-900 text-lg">Telefonszám</p>
              <p className="text-slate-500 font-medium mt-1">+36 1 234 5678</p>
              <p className="text-xs text-slate-400 mt-1">H-P: 08:00 - 18:00</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl"><Mail className="w-6 h-6" /></div>
            <div>
              <p className="font-bold text-slate-900 text-lg">E-mail</p>
              <p className="text-slate-500 font-medium mt-1">hello@buffetapp.hu</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-800 mb-6">Küldj üzenetet</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Neved</label>
              <input required type="text" placeholder="Kovács János" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail címed</label>
              <input required type="email" placeholder="janos@email.hu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Üzenet</label>
              <textarea required rows={4} placeholder="Miben segíthetünk?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium resize-none transition-all"></textarea>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95">
              <Send className="w-5 h-5" /> Üzenet Küldése
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}