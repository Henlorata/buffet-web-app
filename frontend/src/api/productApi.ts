import api from './axiosInstance';
import Product from '@/interfaces/Product_Interface';
import Category from '@/interfaces/Category_Interface';
import Health from '@/interfaces/Health_Interface';

export const productApi = {
  // GET /api/products/categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/products/categories');
    return response.data;
  },

  // GET /api/products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  // Health Check /api/health
  getHealth: async (): Promise<Health> => {
    const response = await api.get<Health>('/health');
    return response.data;
  }
};