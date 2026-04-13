export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 animate-in fade-in duration-500 px-4">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Általános Szerződési Feltételek (ÁSZF)</h1>

        <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
          <p>Hatályos: 2026. árpilis 12-től visszavonásig.</p>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">1. Általános rendelkezések</h2>
          <p>Jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) tartalmazzák a BuffetApp (továbbiakban: Szolgáltató) által üzemeltetett online rendelési rendszer használatának feltételeit.</p>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">2. Rendelés menete</h2>
          <p>A felhasználó a regisztrációt követően tudja kosárba helyezni a kiválasztott termékeket. A rendelés leadásával a felhasználó fizetési kötelezettséget vállal. A rendelések státuszát a rendszer valós időben jelzi.</p>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">3. Árak és fizetés</h2>
          <p>Az oldalon feltüntetett árak forintban értendők és tartalmazzák a törvényben előírt ÁFA-t. A fizetés jelenleg a helyszínen, az átvételkor történik készpénzben vagy bankkártyával.</p>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">4. Lemondási feltételek</h2>
          <p>A leadott rendelést a felhasználó csak addig mondhatja le, amíg annak státusza "Új beérkező". Amint a konyha megkezdte a készítést, a rendelés lemondására online nincs lehetőség, ilyen esetben a pultnál kell érdeklődni.</p>
        </div>
      </div>
    </div>
  );
}