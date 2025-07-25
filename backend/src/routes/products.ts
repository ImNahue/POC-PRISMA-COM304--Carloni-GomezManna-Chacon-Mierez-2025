import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getOutOfStockProducts,
  getExpensiveProducts
} from '../controllers/products';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Special queries
router.get('/category/:categoryId', getProductsByCategory);
router.get('/out-of-stock', getOutOfStockProducts);
router.get('/expensive', getExpensiveProducts);

export default router;