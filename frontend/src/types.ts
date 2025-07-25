// Tipos para categorías
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para productos
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: Category; // Relación opcional con categoría
  createdAt?: string;
  updatedAt?: string;
}