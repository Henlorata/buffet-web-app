import React, { useEffect, useState } from "react";
import PopUpModal from '../Components/PopUp';
import ordersDataRaw from '../Datas/orders_data.json';
import usersData from '../Datas/users_data.json';
import Order from '../Interfaces/Order_Interface';

const OrdersPage: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  useEffect(() => {
    const loadOrders = () => {
      const enrichedOrders: Order[] = (ordersDataRaw as Order[])
        .filter(order => order.status !== 'K') 
        .map(order => {
          const handler = usersData.find(u => u.id === order.handled_by_id);
          return {
            ...order,
            username: handler ? handler.name : undefined
          };
        });
      setOrders(enrichedOrders);
    };
    loadOrders();
  }, []);

  useEffect(() => {
        if (isDetailsOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
        return () => {
          document.body.style.overflow = 'unset';
        };
      }, [isDetailsOpen]);

  const handleOpenDetails = (id: string) => {
    setSelectedOrderId(id);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ú': 
        return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">Order Placed</span>;
      case 'F': 
        return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">Preparing</span>;
      case 'Á': 
        return <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wider">Done</span>;
      default: 
        return <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 text-xs font-bold uppercase tracking-wider">Unknown</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400">
          Total: <span className="text-white font-bold">{orders.length} pcs</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/40 backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Prepper</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-all duration-200 group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {new Date(order.created_at).toLocaleDateString('hu-HU')}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${order.username ? 'text-gray-200 font-medium' : 'text-gray-500 italic'}`}>
                        {order.username || "Waiting to be..."}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <button 
                      onClick={() => handleOpenDetails(order.id)} 
                      className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110"
                    >
                      <span className="text-xl">➩</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailsOpen ? (
          <PopUpModal
            id={selectedOrderId}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
      ): <p></p>}
    </div>
  );
}

export default OrdersPage;