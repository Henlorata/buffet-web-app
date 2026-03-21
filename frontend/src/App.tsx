import React, { useState } from 'react';
import OrderPage from './Pages/Order_Page';
import ViewOrdersPage from './Pages/ViewOrders_Page';
import ViewProfilePage from './Pages/VeiwProfile_Page';
import Navbar  from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home_Page';

export default function App() {
  type TabType = 'Order' | 'viewOrders' | 'Profile' | 'Home';
  const [activeTab, setActiveTab] = useState<TabType>('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Order':
        return <OrderPage />;
      case 'viewOrders':
        return <ViewOrdersPage />;
      case 'Profile':
        return <ViewProfilePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-900 font-sans text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow w-full mx-auto p-4 md:p-10">
        <div className="">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}