import { PrismaClient } from '@prisma/client';
import { createJournalEntry } from '../utils/journal';
import { deleteProductById } from './products.service';

const prisma = new PrismaClient();

export const fetchAllTypes = () => {
  return prisma.type.findMany();
};

export const createType = async (name: string, createdBy: string) => {
  const newType = await prisma.type.create({
    data: {
      name,
      createdBy,
      updatedBy: createdBy,
    },
  });

  await createJournalEntry(`ADMIN created a new type ${name}`, createdBy);
  return newType;
};

export const updateTypeById = async (
  id: string,
  name: string,
  updatedBy: string
) => {
  const updated = await prisma.type.update({
    where: { id },
    data: {
      name,
      updatedBy,
    },
  });

  await createJournalEntry(`ADMIN updated type to ${name}`, updatedBy);
  return updated;
};

export const deleteTypeById = async (id: string, deletedBy: string) => {
  const deleted = await prisma.type.delete({
    where: { id },
  });

  await createJournalEntry(`ADMIN deleted type ${deleted.name}`, deletedBy);
  return deleted;
};

export const deleteProductByTypeId = async (id: string, deletedBy: string) => {
  const deleted = await prisma.type.delete({
    where: { id },
  });

  await createJournalEntry(`ADMIN deleted type ${deleted.name}`, deletedBy);
  return deleted;
};

export const getproductsByTypeId = async (
  typeId: string,
  deletedBy: string
) => {
  const products = await prisma.product.findMany({
    where: { typeId },
    select: { id: true, name: true },
  });
  return products.length;
};
