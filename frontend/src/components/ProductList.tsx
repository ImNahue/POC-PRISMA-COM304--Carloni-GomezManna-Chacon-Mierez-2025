import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getProductsByCategory, getCategories } from '../services/api.ts';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const fetchProducts = async (customFilters = {}) => {
    try {
      const response = await getProducts(customFilters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filterParams: any = {};

    if (filters.category) filterParams.category = filters.category;
    if (filters.minPrice) filterParams.minPrice = filters.minPrice;
    if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;
    if (filters.inStock) filterParams.inStock = filters.inStock === 'true';

    fetchProducts(filterParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: ''
    });
    fetchProducts();
  };

  const handleSpecialQuery = async (queryType: string) => {
    try {
      let response;
      switch (queryType) {
        case 'byCategory':
          if (filters.category) {
            response = await getProductsByCategory(parseInt(filters.category));
            setProducts(response.data);
          }
          break;
        default:
          fetchProducts();
      }
    } catch (error) {
      console.error('Error ejecutando consulta especial:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lista de Productos</h1>
          <Link
            to="/add-category"
            className="btn btn-success"
          >
            + Agregar Categoría
          </Link>
        </div>

        {/* Filtros */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
              <select
                name="category"
                className="input-field"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">Todas las Categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Precio Mín</label>
              <input
                type="number"
                name="minPrice"
                className="input-field"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Precio Máx</label>
              <input
                type="number"
                name="maxPrice"
                className="input-field"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">En Stock</label>
              <select
                name="inStock"
                className="input-field"
                value={filters.inStock}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                className="btn btn-primary"
                onClick={applyFilters}
              >
                Aplicar
              </button>
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Consultas Especiales */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Consultas Especiales</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className={`btn ${filters.category ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={() => handleSpecialQuery('byCategory')}
              disabled={!filters.category}
            >
              Productos por Categoría Seleccionada
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => fetchProducts()}
            >
              Mostrar Todos
            </button>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="card overflow-hidden">
          <div className="table-responsive">
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Descripción</th>
                  <th className="table-header">Precio</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className="table-row">
                    <td className="table-cell">{product.id}</td>
                    <td className="table-cell font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                    <td className="table-cell">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">{product.category?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="btn btn-primary text-xs px-3 py-1"
                        onClick={() => navigate(`/edit-product/${product.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger text-xs px-3 py-1"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos
            </div>
          )}
        </div>

        {/* Botón Agregar Producto Flotante */}
        <button
          className="btn-floating btn-success"
          onClick={() => navigate('/add-product')}
          title="Agregar Nuevo Producto"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductList;
