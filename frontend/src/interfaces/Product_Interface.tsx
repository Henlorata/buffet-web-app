interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img_url: string;
  active: string;
  created_at: string | null;
  updated_at: string | null;
  description: string;
  category_id: string;
  category?: string;
}

export default Product;