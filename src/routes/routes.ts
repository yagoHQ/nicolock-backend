import express from 'express';
import authRouter from './auth.route';
import typesRouter from '../routes/types.route';
import colorsRouter from '../routes/colors.route';
import productsRouter from '../routes/products.route';
import productsColorsRouter from '../routes/productColors.route';

const router = express.Router();

router.use('/api/auth', authRouter);
router.use('/api/types', typesRouter);
router.use('/api/colors', colorsRouter);
router.use('/api/products', productsRouter);
router.use('/api/productColors', productsColorsRouter);

export default router;
