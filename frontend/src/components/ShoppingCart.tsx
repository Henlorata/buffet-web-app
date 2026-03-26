import { X, Trash2 } from "lucide-react";
import ShoppingCartProps from "@/interfaces/ShoppingCart_Interface";

const ShoppingCartModal: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
}) => {
  const items = [
    { quantity: 2, price: 1100, name: "Turkey Ham Sandwich" },
    { quantity: 3, price: 1050, name: "Chocolate Milkshake" },
  ];
  const totalSum = items.reduce((sum, item) => sum + item.price, 0);

  function DeleteFromCart() {
    alert("Product deleted from cart successfully!");
  }

  function PlaceOrder() {
    alert("Order has been placed successfully!");
    onClose();
  }

  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <ul className="space-y-4">
            {items.length == 0 ? (
              <li>The cart is empty.</li>
            ) : (
              items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between group items-center bg-white/5 rounded-lg border border-gray-100 hover:border-blue-500/50 transition-colors p-3"
                >
                  <div>
                    <p className="font-medium text-gray-300 group-hover:text-blue-400">
                      {item.quantity} x {item.name}
                    </p>
                    <p className="text-sm text-gray-400 group-hover:text-blue-400">
                      {item.price} Ft
                    </p>
                  </div>
                  <button
                    onClick={DeleteFromCart}
                    className="text-red-400 hover:text-red-600 transition p-2 cursor-pointer cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          {items.length == 0 ? (
            <p></p>
          ) : (
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-400 uppercase text-xs tracking-widest ml-5">
                Total Price:
              </span>
              <span className="text-2xl font-black text-blue-500 font-mono">
                {totalSum} Ft
              </span>
              <button
                onClick={PlaceOrder}
                disabled={items.length === 0}
                className="w-50 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 mr-5 rounded-xl transition shadow-md active:scale-[0.98] cursor-pointer"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartModal;
