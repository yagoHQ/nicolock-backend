import { Router } from 'express';
import {
  getAllTypes,
  addType,
  updateType,
  deleteType,
} from '../controllers/types.controller';

const router = Router();

router.get('/', getAllTypes);
router.post('/', addType);
router.put('/:id', updateType);
router.delete('/:id', deleteType);

export default router;
