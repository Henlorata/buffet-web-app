import { useEffect, useState } from 'react';
import { productApi } from '@/api/productApi';
import Health from '@/interfaces/Health_Interface';

const Home: React.FC = () => {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    productApi.getHealth()
      .then(data => {
        setHealth(data);
      })
      .catch(error => {
        console.error("[Health Error]:", error);
      });
  }, []);

  if (!health) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">System</h1>
      <div className="mt-2 border p-3 rounded shadow-sm">
        <p><strong>Status:</strong> {health.status}</p>
        <p><strong>Message:</strong> {health.message}</p>
      </div>
    </div>
  );
};

export default Home;