import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getProductsByCategory, getOutOfStockProducts, getExpensiveProducts , getCategories } from '../services/api.ts';
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
        // Carga productos y categorías en paralelo
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories() // Ahora debería funcionar
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchProducts = async (customFilters = {}) => {
    try {
      const response = await getProducts(customFilters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories ();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchProducts(filters);
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
        case 'outOfStock':
          response = await getOutOfStockProducts();
          setProducts(response.data);
          break;
        case 'expensive':
          response = await getExpensiveProducts();
          setProducts(response.data);
          break;
        default:
          fetchProducts();
      }
    } catch (error) {
      console.error('Error executing special query:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Product List</h2>
      
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Filters</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label>Min Price</label>
              <input
                type="number"
                name="minPrice"
                className="form-control"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <label>Max Price</label>
              <input
                type="number"
                name="maxPrice"
                className="form-control"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-2">
              <label>In Stock</label>
              <select
                name="inStock"
                className="form-control"
                value={filters.inStock}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary me-2" onClick={applyFilters}>
                Apply Filters
              </button>
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear
              </button>
              <div className="d-flex justify-content-between mb-3">
                <h2>Lista de Productos</h2>
                <Link to="/add-category" className="btn btn-success">
                 + Agregar Categoría
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Query Buttons */}
      <div className="mb-4">
        <h5>Special Queries</h5>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-info" 
            onClick={() => handleSpecialQuery('byCategory')}
            disabled={!filters.category}
          >
            Products by Selected Category
          </button>
          <button 
            className="btn btn-warning" 
            onClick={() => handleSpecialQuery('outOfStock')}
          >
            Out of Stock Products
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => handleSpecialQuery('expensive')}
          >
            Expensive Products (&gt; $100)
          </button>
        </div>
      </div>

      {/* Product Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>{product.category?.name}</td>
              <td>
                <button 
                  className="btn btn-sm btn-primary me-1"
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        className="btn btn-success mt-3"
        onClick={() => navigate('/add-product')}
      >
        Add New Product
      </button>
    </div>
  );
};

export default ProductList;