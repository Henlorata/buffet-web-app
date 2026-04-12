import { api } from "@/api/axiosInstance";
import { Order } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from 'lucide-react';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function BartOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (error) {
        toast.error("Hiba a betöltéskor");
      }
    };
    loadOrder();

    socket.on("new-order-received", (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
      toast.info("Új rendelés érkezett!", {
        description: `${newOrder.user.fullName} rendelt valamit.`
      });
    });

    socket.on("order-status-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off("new-order-received");
      socket.off("order-status-updated");
    };
  }, []);

  const handlePatch = async (orderID: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
        const response = await api.patch(`/orders/${orderID}/status`, { status: newStatus });
        const updatedOrderFromServer = response.data.order;

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderID ? updatedOrderFromServer : order
          )
        );
        toast.success(response.data.message);
        } catch (error) {
          toast.error("Hiba történt a mentés során.");
        }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Rendelések <span className="text-amber-500">Kezelése</span>
        </h2>
      </div>

      {orders.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <th className="px-6 py-4">Vásárló / Pultos</th>
                  <th className="px-6 py-4">Termékek</th>
                  <th className="px-6 py-4">Összeg</th>
                  <th className="px-6 py-4 bg-amber-100">Státusz</th>
                  <th className="px-6 py-4">Rendelés Időpontja</th>
                  <th className="px-6 py-4">Utolsó módosítás</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className={`${order.status === 'READY' ? 'bg-green-100' : order.status === 'PREPARING' ? 'bg-blue-100' : 'bg-red-100'}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                          <User className="w-4 h-4 text-amber-500" />
                          {order.user.fullName}
                        </div>
                        <div className="text-xs text-gray-400 pl-6">
                          Készíti: <u>{order.handledBy?.fullName || "Még senki..."}</u>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-700">{item.quantity}x</span>
                            <span>{item.product.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{order.totalAmount.toLocaleString()} Ft</span>
                    </td>

                    <td className={`px-6 py-4 ${order.status === 'READY' ? 'bg-green-200' : order.status === 'PREPARING' ? 'bg-blue-200' : 'bg-red-200'}`}>
                      <select
                        className={`px-3 py-1 rounded-full text-sm font-bold uppercase h-10 border cursor-pointer outline-none
                          ${order.status === 'READY' 
                            ? 'bg-green-50 text-green-600 border-green-300'
                            : order.status === 'PREPARING'
                            ? 'bg-blue-50 text-blue-600 border-blue-300' 
                            : 'bg-red-50 text-red-600 border-red-300'}`}
                        value={order.status}
                        onChange={(e) => handlePatch(order.id, e)}
                      >
                        <option value={order.status}>{order.status}</option>
                        
                        {["PREPARING", "READY"].map((status) => 
                          status !== order.status && (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {new Date(order.createdAt).toLocaleString("hu-HU", { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold">
                        {new Date(order.updatedAt).toLocaleString("hu-HU", { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Jelenleg nincs megjeleníthető rendelés.</p>
        </div>
      )}
    </div>
  );
}