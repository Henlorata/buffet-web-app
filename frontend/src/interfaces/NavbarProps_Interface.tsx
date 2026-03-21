type TabType = 'Order' | 'viewOrders' | 'Profile' | 'Home';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default NavbarProps