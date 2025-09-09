import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList.tsx';
import ProductForm from './components/ProductForm.tsx';
import CategoryForm from './components/CategoryForm.tsx';
import CategoryList from './components/CategoryList.tsx';

/* function App() {
  return <h1 style={{ color: 'red' }}>¡La aplicación está funcionando!</h1>;
}  */
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/edit-product/:id" element={<ProductForm />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/add-category" element={<CategoryForm />} />
          <Route path="/edit-category/:id" element={<CategoryForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;