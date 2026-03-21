interface Order {
  id: string;
  status: string;
  user_id: string;
  handled_by_id: string | null;
  created_at: string;
  updated_at: string | null;
  username?: string;
}

export default Order;