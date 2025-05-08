import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /colors - View all colors
export const getAllColors = async (_req: Request, res: Response) => {
  try {
    const colors = await prisma.color.findMany();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colors' });
  }
};

// GET /colors/:id - View one color
export const getColorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const color = await prisma.color.findUnique({ where: { id } });
    if (!color) {
      return res.status(404).json({ error: 'Color not found' });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch color' });
  }
};

// POST /colors - Add a color
export const createColor = async (req: Request, res: Response) => {
  const { name, createdBy } = req.body;
  try {
    console.log('Creating color with data:', req.body);
    const newColor = await prisma.color.create({
      data: {
        name,
        createdBy,
        updatedBy: createdBy,
      },
    });
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create color' });
  }
};

// PUT /colors/:id - Update a color
export const updateColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, updatedBy } = req.body;
  try {
    const updated = await prisma.color.update({
      where: { id },
      data: {
        name,
        updatedBy,
      },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update color' });
  }
};

// DELETE /colors/:id - Delete a color
export const deleteColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.color.delete({ where: { id } });
    res.status(200).json({ message: 'Color deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete color' });
  }
};
