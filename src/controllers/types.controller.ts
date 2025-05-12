// controllers/type.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllTypes,
  createType,
  updateTypeById,
  deleteTypeById,
  deleteProductByTypeId,
} from '../services/types.service';

// GET /types
export const getAllTypes = async (_req: Request, res: Response) => {
  try {
    const types = await fetchAllTypes();
    res.status(200).json(types);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch types' });
  }
};

// POST /types
export const addType = async (req: Request, res: Response) => {
  const { name, createdBy } = req.body;
  try {
    const newType = await createType(name, createdBy);
    res.status(201).json(newType);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create type' });
  }
};

// PUT /types/:id
export const updateType = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, updatedBy } = req.body;
  try {
    const updated = await updateTypeById(id, name, updatedBy);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update type' });
  }
};

// DELETE /types/:id
export const deleteType = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBy = req.body.deletedBy || 'Admin';
  try {
    const deletedProduct = await deleteProductByTypeId(id, deletedBy);
    const deleted = await deleteTypeById(id, deletedBy);
    res.status(200).json({ message: `Deleted type ${deleted.name}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete type' });
  }
};
