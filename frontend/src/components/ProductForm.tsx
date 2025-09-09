import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, createProduct, updateProduct, getCategories } from '../services/api.ts';
import { Product } from '../types';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0
  });

  useEffect(() => {
    fetchCategories();

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
      if (response.data.length > 0 && !id) {
        setProduct(prev => ({ ...prev, categoryId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await getProductById(parseInt(id!));
      setProduct({
        name: response.data.name,
        description: response.data.description || '',
        price: response.data.price,
        stock: response.data.stock,
        categoryId: response.data.categoryId
      });
    } catch (error) {
      console.error('Error obteniendo producto:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'categoryId' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateProduct(parseInt(id), product);
      } else {
        await createProduct(product);
      }
      navigate('/');
    } catch (error) {
      console.error('Error guardando producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ingresa el nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Describe el producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="0.00"
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                type="text"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="0"
              />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary flex-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
