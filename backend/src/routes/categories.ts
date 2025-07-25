import { Router } from 'express';
import {
  getCategories,
  createCategory,
  getCategoryById
} from '../controllers/categories';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);

export default router;