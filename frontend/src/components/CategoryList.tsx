import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Categorías</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name} - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;