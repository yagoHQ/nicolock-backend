import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadStreamToCloudinary } from '../utils/cloudinary';
import { createJournalEntry } from '../utils/journal';

const prisma = new PrismaClient();

// GET /products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        type: {
          select: {
            name: true,
            createdOn: true,
          },
        },
      },
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// POST /products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, typeId, createdBy } = req.body;

    let uploadedImageUrl = '';
    if (req.file && req.file.buffer) {
      uploadedImageUrl = await uploadStreamToCloudinary(
        req.file.buffer,
        'products'
      );
    }

    const newProduct = await prisma.product.create({
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

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('[createProduct]', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// PUT /products/:id
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, typeId, updatedBy } = req.body;

  try {
    let dataToUpdate: any = {
      name,
      description,
      typeId,
      updatedBy,
    };

    if (req.file && req.file.buffer) {
      const uploadedImage = await uploadStreamToCloudinary(
        req.file.buffer,
        'products'
      );
      dataToUpdate.image = uploadedImage;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        type: true,
      },
    });

    await createJournalEntry(`ADMIN updated product to ${name}`, updatedBy);

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('[updateProduct]', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE /products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBy = req.body.deletedBy || 'Admin'; // fallback if not passed

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    await prisma.productColor.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    await createJournalEntry(
      `ADMIN deleted product ${product.name}`,
      deletedBy
    );

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('[deleteProduct]', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
