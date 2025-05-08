import { Router } from 'express';
import {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} from '../controllers/colors.controller';

const router = Router();

router.get('/', getAllColors);
router.post('/', createColor);
router.put('/:id', updateColor);
router.delete('/:id', deleteColor);

export default router;
