import React, { useEffect, useState } from 'react';
import Product from '@/interfaces/Product_Interface';
import MyQuestion from '@/components/MyQuestion';

const ProductCard: React.FC<Product> = ({ id, name, price, quantity, category, description, img_url }) => {
  const [Qty, setQty] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isModalOpen]);

  const confirmAddToCart = async () => {
    setIsModalOpen(false);
    alert(`Product in the cart!`);
  };

  const denyAddToCart = async () => {
    setIsModalOpen(false);
    alert(`Cart is deleted!`);
  };

  const handleToCart = async () => {
    let filter : number = 0;
    if (Qty <= 0) {
      alert("You can't order this low!");
      return filter = 1;
    }

    if (Qty > quantity) {
      alert(`You can't order this much!`);
      return filter = 1;
    }

    if (filter == 0) {
      setIsModalOpen(true);
      return filter = 0;
    }
  };

  return (
    <div id={`${id}`} className="flex flex-col h-full max-w-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
      <div className="relative h-100 overflow-hidden border-b">
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          src={img_url || 'https://via.placeholder.com/300'} 
          alt={name} 
        />
      </div>

      <div className="flex flex-col flex-grow px-5 py-4">
        <div className="mb-2">
          <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">{category}</span>
          <h3 className="font-bold text-lg text-gray-100 line-clamp-1">{name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        </div>

        <div className="mt-auto">
          <div className="text-xl font-extrabold font-mono text-blue-500 mb-4">
            {price.toLocaleString()} Ft
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1"
              max={quantity}
              value={quantity === 0 ? 0 : Qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold text-gray-400 font-mono"
            />
            <p className="text-[15px] text-gray-400 font-semibold mb-1 text-center">DB</p>
            <button 
              disabled={quantity === 0}
              onClick={handleToCart}
              className={`flex-grow bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 active:scale-95 text-sm cursor-pointer
                ${quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Kosárba
            </button>
          </div>
        </div>
      </div>

      <MyQuestion 
        isOpen={isModalOpen}
        title="Active cart found!"
        description="You already have a previously started cart. Would you like to continue with it?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={confirmAddToCart}
        onCancel={denyAddToCart}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductCard;