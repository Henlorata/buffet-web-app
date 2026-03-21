interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  price?: number;
  quantity?: number;
}

export default ShoppingCartProps;