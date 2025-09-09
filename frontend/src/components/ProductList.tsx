import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getCategories, resetDatabase, bulkDeleteProducts } from '../services/api.ts';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Icon components using inline SVG
const EmptyIcon = () => (
  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const BulkDeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M9 11v6m6-6v6" />
  </svg>
);



const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: ''
  });
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Update applyFilters to handle "Sin stock" filter
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
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters = filters) => {
    const filterParams: any = {};

    if (currentFilters.category) filterParams.category = currentFilters.category;
    if (currentFilters.minPrice) filterParams.minPrice = currentFilters.minPrice;
    if (currentFilters.maxPrice) filterParams.maxPrice = currentFilters.maxPrice;

    // Handle inStock filter with three options: '', 'true', 'false'
    if (currentFilters.inStock === 'true') {
      filterParams.inStock = 'true';
    } else if (currentFilters.inStock === 'false') {
      filterParams.inStock = 'false';
    }

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

  // Bulk operations handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedProducts.length} producto(s)?`)) {
      try {
        await bulkDeleteProducts(selectedProducts);
        setSelectedProducts([]);
        fetchProducts();
        alert('Productos eliminados correctamente.');
      } catch (error) {
        console.error('Error eliminando productos:', error);
        alert('Error al eliminar productos.');
      }
    }
  };



  useEffect(() => {
    setShowBulkActions(selectedProducts.length > 0);
  }, [selectedProducts]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lista de Productos</h1>
          <div className="flex gap-2 items-center">
            <Link
              to="/categories"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Gestionar Categorías
            </Link>
            <Link
              to="/add-category"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Agregar Categoría
            </Link>
            <button
              onClick={async () => {
                if (window.confirm('¿Estás seguro de que quieres reiniciar la base de datos? Esta acción eliminará todos los productos y categorías.')) {
                  try {
                    await resetDatabase();
                    alert('Base de datos reiniciada correctamente.');
                    // Optionally, refresh products and categories after reset
                    fetchProducts();
                    const categoriesRes = await getCategories();
                    setCategories(categoriesRes.data);
                  } catch (error) {
                    alert('Error al reiniciar la base de datos.');
                    console.error(error);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              aria-label="Reiniciar base de datos"
              title="Reiniciar base de datos"
            >
              Reiniciar BD
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-800">
                  {selectedProducts.length} producto(s) seleccionado(s)
                </span>

                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  <BulkDeleteIcon />
                  Eliminar Seleccionados
                </button>
              </div>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 transition-shadow hover:shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon />
            <h2 className="text-lg font-semibold text-gray-700">Filtros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-600 mb-1" aria-describedby="category-help">Categoría</label>
              <select
                id="category-filter"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
                value={filters.category}
                onChange={handleFilterChange}
                aria-describedby="category-help"
              >
                <option value="">Todas las Categorías</option>
                <option value="none">Sin categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span id="category-help" className="sr-only">Selecciona una categoría para filtrar productos</span>
            </div>
            <div>
              <label htmlFor="min-price-input" className="block text-sm font-medium text-gray-600 mb-1">Precio Mín</label>
              <input
                id="min-price-input"
                type="number"
                name="minPrice"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
                aria-describedby="min-price-help"
              />
              <span id="min-price-help" className="sr-only">Ingresa el precio mínimo para filtrar productos</span>
            </div>
            <div>
              <label htmlFor="max-price-input" className="block text-sm font-medium text-gray-600 mb-1">Precio Máx</label>
              <input
                id="max-price-input"
                type="number"
                name="maxPrice"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="999"
                min="0"
                aria-describedby="max-price-help"
              />
              <span id="max-price-help" className="sr-only">Ingresa el precio máximo para filtrar productos</span>
            </div>
            <div>
              <label htmlFor="stock-filter" className="block text-sm font-medium text-gray-600 mb-1">Disponibilidad</label>
              <select
                id="stock-filter"
                name="inStock"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
                value={filters.inStock}
                onChange={handleFilterChange}
                aria-describedby="stock-help"
              >
                <option value="">Todos los productos</option>
                <option value="true">Solo en stock</option>
                <option value="false">Sin stock</option>
              </select>
              <span id="stock-help" className="sr-only">Selecciona si mostrar solo productos en stock</span>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              <button
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={clearFilters}
                aria-describedby="clear-help"
              >
                Limpiar
              </button>
              <span id="clear-help" className="sr-only">Limpia todos los filtros</span>
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Lista de productos">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className={`hover:bg-gray-50 focus-within:bg-gray-50 transition-colors ${selectedProducts.includes(product.id) ? 'bg-blue-50' : ''}`} role="row">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={product.description}>{product.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`} aria-label={`Stock: ${product.stock}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => navigate(`/edit-product/${product.id}`)}
                        aria-label={`Editar producto ${product.name}`}
                      >
                        <EditIcon />
                        Editar
                      </button>
                      <button
                        className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => handleDelete(product.id)}
                        aria-label={`Eliminar producto ${product.name}`}
                      >
                        <DeleteIcon />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 px-4" role="status" aria-live="polite">
              <EmptyIcon />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-4">Intenta ajustar los filtros o agregar nuevos productos.</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => navigate('/add-product')}
                aria-describedby="add-product-help"
              >
                Agregar Producto
              </button>
              <span id="add-product-help" className="sr-only">Navega a la página para agregar un nuevo producto</span>
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
