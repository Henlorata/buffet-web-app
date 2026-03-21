interface PopUp {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export default PopUp;