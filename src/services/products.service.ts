// services/product.service.ts
import { PrismaClient } from '@prisma/client';
import { uploadStreamToCloudinary } from '../utils/cloudinary';
import { createJournalEntry } from '../utils/journal';
import { deleteFromS3, extractS3Key } from '../utils/s3Helpers';

const prisma = new PrismaClient();
interface S3MulterFile extends Express.Multer.File {
  location: string;
}

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
  if (file && 'location' in file && typeof file.location === 'string') {
    uploadedImageUrl = file.location;
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
  const dataToUpdate: any = {
    name,
    description,
    typeId,
    updatedBy,
  };

  if (file && 'location' in file && typeof file.location === 'string') {
    dataToUpdate.image = file.location;
  }

  const existing = await prisma.productColor.findUnique({ where: { id } });

  if (existing?.image && dataToUpdate.image) {
    const oldKey = extractS3Key(existing.image);
    await deleteFromS3(oldKey);
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

  if (product.image) {
    const imageKey = extractS3Key(product.image);
    await deleteFromS3(imageKey);
  }

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
