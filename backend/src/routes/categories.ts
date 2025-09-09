import { Router } from 'express';
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  resetDatabase
} from '../controllers/categories';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.post('/reset', resetDatabase);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
