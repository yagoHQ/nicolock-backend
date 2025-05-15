// controllers/product.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllProducts,
  createNewProduct,
  fetchProductsById,
  updateProductById,
  deleteProductById,
  getDashboardStats,
} from '../services/products.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// GET /products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await fetchAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// POST /products
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, typeId, createdBy } = req.body;

  try {
    const product = await createNewProduct(
      name,
      description,
      typeId,
      createdBy,
      req.file
    );
    res.status(201).json(product);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(500).json({
        error: `Product with name ${name} already exists`,
      });
      return;
    }
    console.error('[createProduct]', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// GET /products/:id
export const getProductById = async (_req: Request, res: Response) => {
  try {
    const { id } = _req.params;
    const products = await fetchProductsById(id);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// PUT /products/:id
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, typeId, updatedBy } = req.body;

  try {
    const updated = await updateProductById(
      id,
      name,
      description,
      typeId,
      updatedBy,
      req.file
    );
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(500).json({
        error: `Product with name ${name} already exists`,
      });
      return;
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE /products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBy = req.body.deletedBy || 'Admin';

  try {
    const deleted = await deleteProductById(id, deletedBy);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// GET /dashboard
export const getDashboardData = async (_req: Request, res: Response) => {
  try {
    const data = await getDashboardStats();
    res.status(200).json(data);
  } catch (error) {
    console.error('[getDashboardData]', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};
