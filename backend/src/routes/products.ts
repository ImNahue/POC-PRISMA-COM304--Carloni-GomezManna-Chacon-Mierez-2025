import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getOutOfStockProducts,
  getExpensiveProducts,
  bulkDeleteProducts
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

// Bulk operations routes
router.post('/bulk-delete', bulkDeleteProducts);

export default router;
