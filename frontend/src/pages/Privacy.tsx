export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 animate-in fade-in duration-500 px-4">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Adatvédelmi Tájékoztató</h1>

        <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
          <p>A BuffetApp elkötelezett a felhasználók személyes adatainak védelme iránt. Jelen tájékoztató célja, hogy bemutassa, hogyan kezeljük az adataidat.</p>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Milyen adatokat gyűjtünk?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Regisztrációs adatok (Név, E-mail cím, Jelszó - titkosítva)</li>
            <li>Rendelési előzmények (Mit, mikor és mennyiért rendeltél)</li>
            <li>Technikai adatok (IP cím, böngésző típusa sütik formájában a működéshez)</li>
          </ul>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Hogyan használjuk fel az adatokat?</h2>
          <p>Az adatokat kizárólag a szolgáltatás nyújtására, a rendelések teljesítésére, számlázásra és a felhasználói fiókod biztonságának fenntartására használjuk. Harmadik félnek adatokat nem adunk ki, kivéve a jogszabályi kötelezettségek esetén.</p>

          <h2 className="text-2xl font-black text-slate-800 mt-8 mb-4">Adataid törlése</h2>
          <p>Bármikor kérheted a fiókod és a hozzá tartozó személyes adatok végleges törlését a Kapcsolat oldalon keresztül, vagy a hello@buffetapp.hu e-mail címen. Kérjük vedd figyelembe, hogy a számviteli törvények értelmében a számlázási adatokat bizonyos ideig meg kell őriznünk.</p>
        </div>
      </div>
    </div>
  );
}