// controllers/color.controller.ts
import { Request, Response } from 'express';
import {
  fetchAllColors,
  fetchColorById,
  createNewColor,
  updateColorById,
  deleteColorById,
} from '../services/colors.service';

// GET /colors
export const getAllColors = async (_req: Request, res: Response) => {
  try {
    const colors = await fetchAllColors();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colors' });
  }
};

// GET /colors/:id
export const getColorById = async (req: Request, res: Response) => {
  try {
    const color = await fetchColorById(req.params.id);
    if (!color) return res.status(404).json({ error: 'Color not found' });
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch color' });
  }
};

// POST /colors
export const createColor = async (req: Request, res: Response) => {
  const { name, createdBy } = req.body;
  try {
    const newColor = await createNewColor(name, createdBy);
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create color' });
  }
};

// PUT /colors/:id
export const updateColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, updatedBy } = req.body;
  try {
    const updated = await updateColorById(id, name, updatedBy);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update color' });
  }
};

// DELETE /colors/:id
export const deleteColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBy = req.body.deletedBy || 'Admin';

  try {
    const deleted = await deleteColorById(id, deletedBy);
    if (!deleted) return res.status(404).json({ error: 'Color not found' });

    res.status(200).json({ message: 'Color deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete color' });
  }
};
