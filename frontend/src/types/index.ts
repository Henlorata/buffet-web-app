export type Role = 'CUSTOMER' | 'BARTENDER' | 'ADMIN';
export type OrderStatus = 'CART' | 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  category?: {
    name: string;
    slug: string;
  };
}

export interface Order {
  id: string;
  handledBy: {
    fullName: string | null;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
  };
  items: {
    quantity: number;
    unitPriceAtPurchase: number;
    product: {
      name: string;
    };
  }[];
}