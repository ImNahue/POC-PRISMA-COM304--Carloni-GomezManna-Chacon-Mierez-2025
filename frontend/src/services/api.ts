import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getProducts = (filters = {}) => api.get('/products', { params: filters });
export const getProductById = (id: number) => api.get(`/products/${id}`);
export const createProduct = (productData: any) => api.post('/products', productData);
export const updateProduct = (id: number, productData: any) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// Special queries
export const getProductsByCategory = (categoryId: number) => api.get(`/products/category/${categoryId}`);
export const getOutOfStockProducts = () => api.get('/products/out-of-stock');
export const getExpensiveProducts = () => api.get('/products/expensive');

export const getCategories = () => api.get('/categories');

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

export default api;