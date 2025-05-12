// services/color.service.ts
import { PrismaClient } from '@prisma/client';
import { createJournalEntry } from '../utils/journal';

const prisma = new PrismaClient();

export const fetchAllColors = () => {
  return prisma.color.findMany();
};

export const fetchColorById = (id: string) => {
  return prisma.color.findUnique({ where: { id } });
};

export const createNewColor = async (name: string, createdBy: string) => {
  const newColor = await prisma.color.create({
    data: {
      name,
      createdBy,
      updatedBy: createdBy,
    },
  });

  await createJournalEntry(`ADMIN created color ${name}`, createdBy);
  return newColor;
};

export const updateColorById = async (
  id: string,
  name: string,
  updatedBy: string
) => {
  const updated = await prisma.color.update({
    where: { id },
    data: {
      name,
      updatedBy,
    },
  });

  await createJournalEntry(`ADMIN updated color to ${name}`, updatedBy);
  return updated;
};

export const deleteColorById = async (id: string, deletedBy: string) => {
  const color = await prisma.color.findUnique({ where: { id } });
  if (!color) return null;

  await prisma.color.delete({ where: { id } });

  await createJournalEntry(`ADMIN deleted color ${color.name}`, deletedBy);
  return color;
};
