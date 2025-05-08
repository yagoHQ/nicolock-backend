import express from 'express';
import typesRouter from '../routes/types.route';
import colorsRouter from '../routes/colors.route';

const router = express.Router();

router.use('/api/types', typesRouter);
router.use('/api/colors', colorsRouter);

export default router;
