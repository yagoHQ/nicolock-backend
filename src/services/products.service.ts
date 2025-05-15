// services/product.service.ts
import { PrismaClient } from '@prisma/client';
import { uploadStreamToCloudinary } from '../utils/cloudinary';
import { createJournalEntry } from '../utils/journal';

const prisma = new PrismaClient();

export const fetchAllProducts = () => {
  return prisma.product.findMany({
    include: {
      type: {
        select: {
          name: true,
          createdOn: true,
        },
      },
    },
  });
};

export const createNewProduct = async (
  name: string,
  description: string,
  typeId: string,
  createdBy: string,
  file?: Express.Multer.File
) => {
  let uploadedImageUrl = '';
  if (file?.buffer) {
    uploadedImageUrl = await uploadStreamToCloudinary(file.buffer, 'products');
  }

  const product = await prisma.product.create({
    data: {
      name,
      image: uploadedImageUrl,
      description,
      typeId,
      createdBy,
      updatedBy: createdBy,
    },
    include: {
      type: true,
    },
  });

  await createJournalEntry(`ADMIN created new product ${name}`, createdBy);
  return product;
};

export const fetchProductsById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      type: {
        select: {
          name: true,
          createdOn: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error(`Product with id "${id}" not found`);
  }

  return product;
};

export const updateProductById = async (
  id: string,
  name: string,
  description: string,
  typeId: string,
  updatedBy: string,
  file?: Express.Multer.File
) => {
  const dataToUpdate: any = { name, description, typeId, updatedBy };

  if (file?.buffer) {
    const uploadedImage = await uploadStreamToCloudinary(
      file.buffer,
      'products'
    );
    dataToUpdate.image = uploadedImage;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: dataToUpdate,
    include: { type: true },
  });

  await createJournalEntry(`ADMIN updated product to ${name}`, updatedBy);
  return updated;
};

export const deleteProductById = async (id: string, deletedBy: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;

  await prisma.productColor.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  await createJournalEntry(`ADMIN deleted product ${product.name}`, deletedBy);
  return product;
};

export const getDashboardStats = async () => {
  const [totalProducts, totalColors, recentUpdates] = await Promise.all([
    prisma.product.count(),
    prisma.color.count(),
    prisma.journalEntry.findMany({
      orderBy: { createdOn: 'desc' },
      take: 5,
      select: {
        createdOn: true,
        entry: true,
      },
    }),
  ]);

  return { totalProducts, totalColors, recentUpdates };
};
