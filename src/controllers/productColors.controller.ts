// controllers/productColor.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllProductColors,
  addNewProductColor,
  updateProductColorById,
  deleteProductColorById,
  getProductColorsByProduct,
} from '../services/productColors.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// GET /product-colors
export const getAllProductColors = async (_req: Request, res: Response) => {
  try {
    const data = await fetchAllProductColors();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product colors' });
  }
};

// POST /product-colors
export const addProductColor = async (req: Request, res: Response) => {
  const { productId, colorId, productName, createdBy } = req.body;

  try {
    const newColor = await addNewProductColor(
      productId,
      colorId,
      productName,
      createdBy,
      req.files as any
    );
    res.status(201).json(newColor);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(500).json({
        error: 'Color already exists',
      });
      return;
    }
    console.error('[addProductColor]', error);
    res.status(500).json({ error: 'Failed to create product color' });
  }
};

// PUT /product-colors/:id
export const updateProductColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    productId,
    colorId,
    productName,
    updatedBy = 'ADMIN',
    name,
  } = req.body;

  try {
    const updated = await updateProductColorById(
      id,
      productId,
      colorId,
      productName,
      updatedBy,
      req.files as any
    );
    res.status(200).json(updated);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(500).json({
        error: `Color already exists`,
      });
      return;
    }
    console.error('[updateProductColor]', error);
    res.status(500).json({ error: 'Failed to update product color' });
  }
};

// DELETE /product-colors/:id
export const deleteProductColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { deletedBy = 'Admin', productName } = req.body;

  try {
    const deleted = await deleteProductColorById(id, productName, deletedBy);
    if (!deleted)
      return res.status(404).json({ error: 'Product color not found' });

    res.status(200).json({ message: 'Product color deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product color' });
  }
};

// GET /product-colors/by-product/:productId
export const getProductColorsByProductId = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const data = await getProductColorsByProduct(id);
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch product colors for this product' });
  }
};

// GET /product-colors/by-product/:productId
export const getProductColorById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await getProductColorsByProduct(id);
    if (!data) {
      return res.status(404).json({ error: 'Product color not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product color' });
  }
};
