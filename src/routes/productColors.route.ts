import { Router } from 'express';
import {
  getAllProductColors,
  addProductColor,
  updateProductColor,
  deleteProductColor,
  getProductColorsByProductId,
} from '../controllers/productColors.controller';

import { upload } from '../middlewares/upload';

const router = Router();

const uploadBoth = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'model', maxCount: 1 },
]);

router.get('/', getAllProductColors);
router.get('/:id', getProductColorsByProductId);
router.post('/', uploadBoth, addProductColor);
router.put('/:id', uploadBoth, updateProductColor);
router.delete('/:id', deleteProductColor);

export default router;
