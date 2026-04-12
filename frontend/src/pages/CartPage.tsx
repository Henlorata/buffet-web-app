import ShoppingCart from '../components/ShoppingCart';

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Pénztár</h1>
      <ShoppingCart />
    </div>
  );
}