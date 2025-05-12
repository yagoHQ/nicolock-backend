// services/productColor.service.ts
import { PrismaClient } from '@prisma/client';
import { uploadStreamToCloudinary } from '../utils/cloudinary';
import { createJournalEntry } from '../utils/journal';

const prisma = new PrismaClient();

export const fetchAllProductColors = () => {
  return prisma.productColor.findMany({
    include: {
      color: { select: { name: true } },
      product: {
        select: {
          image: true,
          name: true,
          type: { select: { name: true } },
        },
      },
    },
  });
};

export const addNewProductColor = async (
  productId: string,
  colorId: string,
  productName: string,
  createdBy: string,
  files?: { image?: Express.Multer.File[]; model?: Express.Multer.File[] }
) => {
  let imageUrl = '';
  let modelUrl = '';

  if (files?.image?.[0]) {
    imageUrl = await uploadStreamToCloudinary(
      files.image[0].buffer,
      'productColors'
    );
  }

  if (files?.model?.[0]) {
    modelUrl = await uploadStreamToCloudinary(
      files.model[0].buffer,
      'productModels'
    );
  }

  const newColor = await prisma.productColor.create({
    data: {
      productId,
      colorId,
      image: imageUrl,
      model: modelUrl,
    },
  });

  await createJournalEntry(
    `ADMIN added a new color variant to product ${productName}`,
    createdBy
  );
  return newColor;
};

export const updateProductColorById = async (
  id: string,
  productId: string,
  colorId: string,
  productName: string,
  updatedBy: string,
  files?: { image?: Express.Multer.File[]; model?: Express.Multer.File[] }
) => {
  const updateData: any = { colorId, productId };

  if (files?.image?.[0]) {
    updateData.image = await uploadStreamToCloudinary(
      files.image[0].buffer,
      'productColors'
    );
  }

  if (files?.model?.[0]) {
    updateData.model = await uploadStreamToCloudinary(
      files.model[0].buffer,
      'productModels'
    );
  }

  const updated = await prisma.productColor.update({
    where: { id },
    data: updateData,
  });

  await createJournalEntry(
    `ADMIN updated product color for product ${productName}`,
    updatedBy
  );
  return updated;
};

export const deleteProductColorById = async (
  id: string,
  productName: string,
  deletedBy: string
) => {
  const existing = await prisma.productColor.findUnique({ where: { id } });

  if (!existing) return null;

  await prisma.productColor.delete({ where: { id } });

  await createJournalEntry(
    `ADMIN deleted product color of product ${productName}`,
    deletedBy
  );
  return true;
};

export const getProductColorsByProduct = (productId: string) => {
  return prisma.productColor.findMany({
    where: { productId },
    include: {
      color: { select: { id: true, name: true } },
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          type: { select: { name: true } },
        },
      },
    },
  });
};
