import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /types
export const getAllTypes = async (_req: Request, res: Response) => {
  try {
    const types = await prisma.type.findMany();
    res.status(200).json(types);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch types' });
  }
};

// POST /types
export const addType = async (req: Request, res: Response) => {
  const { name, createdBy } = req.body;
  try {
    const newType = await prisma.type.create({
      data: {
        name,
        createdBy,
        updatedBy: createdBy,
      },
    });
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
    const updated = await prisma.type.update({
      where: { id },
      data: { name, updatedBy },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update type' });
  }
};

// DELETE /types/:id
export const deleteType = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.type.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Type deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete type' });
  }
};
