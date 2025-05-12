import { Router } from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardData,
} from '../controllers/products.controller';
import { upload } from '../middlewares/multer';

const router = Router();

router.get('/', getAllProducts);
router.get('/dashboard', getDashboardData);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
