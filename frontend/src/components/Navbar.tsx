import NavbarProps from "@/interfaces/NavbarProps_Interface";
type TabType = 'Order' | 'viewOrders' | 'Profile' | 'Home';

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const getTabStyle = (tabName: TabType): string => {
    const baseStyle = "text-xl md:text-2xl font-extrabold font-serif text-gray-300 tracking-tight cursor-pointer transition-all duration-200 m-3 hover:text-white";
    const activeStyle = "border-b-4 border-blue-500 pb-1 text-white";
    
    return activeTab === tabName ? `${baseStyle} ${activeStyle}` : baseStyle;
  };

  return (
    <nav className="bg-gray-900/60 backdrop-blur-md sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 
            onClick={() => setActiveTab('Home')} 
            className={getTabStyle('Home')}
          >
            Home
          </h1>
          <h1 
            onClick={() => setActiveTab('Order')} 
            className={getTabStyle('Order')}
          >
            Order
          </h1>
          <h1 
            onClick={() => setActiveTab('viewOrders')} 
            className={getTabStyle('viewOrders')}
          >
            My Orders
          </h1>
        </div>

        <div className="flex items-center group">
          <img 
            src="https://placehold.co/500x500/png" 
            alt="Profile" 
            title='Edit profile'
            onClick={() => setActiveTab('Profile')}
            className={`h-12 w-12 rounded-full border-2 object-cover cursor-pointer transition-all duration-300 
              ${activeTab === 'Profile' ? 'border-blue-500 scale-110' : 'border-transparent hover:border-blue-400'}`}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar