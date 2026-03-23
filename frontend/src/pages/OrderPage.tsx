import { useEffect, useState } from 'react';
import Product from '@/interfaces/Product_Interface';
import ProductCard from '@/components/ProductCard';
import ShoppingCartModal from '@/components/ShoppingCart';
import rawProductData from '@/datas/products_data.json';
import rawCategoryData from '@/datas/categories_data.json';

const OrderPage: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const enrichedProducts: Product[] = (rawProductData as Product[])
        .map(product => {
          const handler = rawCategoryData.find(c => c.id === product.category_id);
          return {
            ...product,
            category: handler ? handler.name : undefined
          };
        });
      setProducts(enrichedProducts);
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  function ProductData(e: React.ChangeEvent<HTMLSelectElement>) {
    const kiv_kategoria = e.target.value;
    console.log(kiv_kategoria);
  }
  
  return (
    <div className='mt-10'>
      <div className='flex justify-between'>
        <select name="kategoriak" id="kategoriak" onChange={ ProductData }
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
              <option className="bg-blue-900">-- All Categories --</option>
          {products.map((product, index) => (
            <option key={index} className="bg-blue-900">{product.category}</option>
          ))}

        </select>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer' onClick={() => setIsCartOpen(true)}>🛒</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 mt-10">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            img_url={product.img_url}
            quantity={product.quantity}
            description={product.description}
            created_at={product.created_at}
            updated_at={product.updated_at}
            active={product.active}
            category_id={product.category_id}
          />
        ))}

        <ShoppingCartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </div>
  );
}

export default OrderPage;