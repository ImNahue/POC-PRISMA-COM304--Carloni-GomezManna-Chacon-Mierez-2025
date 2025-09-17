import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

export const getProducts = (filters = {}) => api.get('/products', { params: filters });
export const getProductById = (id: number) => api.get(`/products/${id}`);
export const createProduct = (productData: any) => api.post('/products', productData);
export const updateProduct = (id: number, productData: any) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

export const bulkDeleteProducts = (productIds: number[]) => api.post('/products/bulk-delete', { productIds });

// Special queries
export const getProductsByCategory = (categoryId: number) => api.get(`/products/category/${categoryId}`);
export const getCategories = () => api.get('/categories');

export const getCategoryById = (id: number) => api.get(`/categories/${id}`);

export const createCategory = async (categoryData: {
  name: string;
  description?: string;
}) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Esto permite manejar el error en el componente
  }
};

export const updateCategory = (id: number, categoryData: { name: string; description?: string }) => api.put(`/categories/${id}`, categoryData);

export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

export const resetDatabase = () => api.post('/categories/reset');

export default api;
