import { Router } from 'express';
import {
  getAllProductColors,
  addProductColor,
  updateProductColor,
  deleteProductColor,
  getProductColorsByProductId,
  getProductColorById,
} from '../controllers/productColors.controller';

import { upload } from '../middlewares/upload';

const router = Router();

const uploadBoth = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'model', maxCount: 1 },
]);

router.get('/', getAllProductColors);
router.get('/:id', getProductColorsByProductId);
router.get('/color/:id', getProductColorById);
router.post('/', uploadBoth, addProductColor);
router.put('/:id', uploadBoth, updateProductColor);
router.delete('/:id', deleteProductColor);

export default router;
