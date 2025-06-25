// services/productColor.service.ts
import { PrismaClient } from '@prisma/client';
import { createJournalEntry } from '../utils/journal';
import { deleteFromS3, extractS3Key } from '../utils/s3Helpers';

const prisma = new PrismaClient();
interface S3MulterFile extends Express.Multer.File {
  location: string;
}

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

  const imageFile = files?.image?.[0] as S3MulterFile | undefined;
  const modelFile = files?.model?.[0] as S3MulterFile | undefined;

  if (imageFile?.location) {
    imageUrl = imageFile.location;
  }

  if (modelFile?.location) {
    modelUrl = modelFile.location;
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
  const existing = await prisma.productColor.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error('Product color not found');
  }

  const updateData: any = {};

  const imageFile = files?.image?.[0] as S3MulterFile | undefined;
  const modelFile = files?.model?.[0] as S3MulterFile | undefined;

  if (imageFile?.location) {
    // Delete old image from S3
    if (existing.image) {
      const oldImageKey = extractS3Key(existing.image);
      await deleteFromS3(oldImageKey);
    }
    updateData.image = imageFile.location;
  }

  if (modelFile?.location) {
    // Delete old model from S3
    if (existing.model) {
      const oldModelKey = extractS3Key(existing.model);
      await deleteFromS3(oldModelKey);
    }
    updateData.model = modelFile.location;
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
  if (existing.image) {
    const imageKey = extractS3Key(existing.image);
    await deleteFromS3(imageKey);
  }

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

export const getProductColorById = (id: string) => {
  return prisma.productColor.findUnique({
    where: { id },
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
