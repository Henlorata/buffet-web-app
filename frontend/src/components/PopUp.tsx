import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import PopUp from '@/interfaces/PopUp_Interface';
import connectorDataRaw from '@/datas/connectors_data.json';
import productsData from '@/datas/products_data.json';

const PopUpModal: React.FC<PopUp> = ({ isOpen, onClose, id }) => {
  const [enrichedItems, setEnrichedItems] = useState<any[]>([]);

  useEffect(() => {
    if (!id || !isOpen) return;

    const loadDetails = () => {
      const joinedData = (connectorDataRaw as any[])
        .filter(conn => String(conn.order_id) === String(id))
        .map(conn => {
          const product = (productsData as any[]).find(p => p.id === conn.product_id);
          return {
            ...conn,
            productName: product ? product.name : "Unknown Product"
          };
        });

      setEnrichedItems(joinedData);
    };

    loadDetails();
  }, [id, isOpen]);

  const totalPrice = enrichedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md" onClick={onClose}>
      <div className="relative z-[100] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Order details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {enrichedItems.length > 0 ? (
              enrichedItems.map((item, index) => (
                <div key={index} className="mb-3 p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center group hover:border-blue-500/50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">{item.quantity} pcs x {item.price} Ft</p>
                  </div>
                  <div className="text-right font-mono text-blue-400 font-bold">
                    {item.price * item.quantity} Ft
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10 italic">Subjects not found.</p>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total price:</span>
                <span className="text-2xl font-black text-blue-500 font-mono">
                    {totalPrice.toLocaleString()} Ft
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;