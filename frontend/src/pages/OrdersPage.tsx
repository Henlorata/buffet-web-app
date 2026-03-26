const OrdersPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-2">
          <span className="text-amber-600 font-bold">Összesen:</span>{" "}
          <span className="text-gray-600 font-bold">5 db</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-50 bg-white backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Státusz
                </th>
                <th className="px-6 py-4 text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Dátum
                </th>
                <th className="px-6 py-4 text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Készítő
                </th>
                <th className="px-6 py-4 text-xs font-bold text-amber-600 uppercase tracking-widest text-center">
                  Részletek
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-200 transition-all duration-200 group">
                <td className="px-6 py-5 whitespace-nowrap">Folyamatban</td>

                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span className="font-medium">2026. 03. 11.</span>
                  </div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm text-gray-600 italic`}>
                      "Kiosztásra vár..."
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <button className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                    <span className="text-xl">➩</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
