import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadStreamToCloudinary } from '../utils/cloudinary';
import { createJournalEntry } from '../utils/journal';

const prisma = new PrismaClient();

// GET all product colors
export const getAllProductColors = async (_req: Request, res: Response) => {
  try {
    const colors = await prisma.productColor.findMany({
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
    res.status(200).json(colors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product colors' });
  }
};

// POST /product-colors - Add product color
export const addProductColor = async (req: Request, res: Response) => {
  const { productId, productName, colorId, createdBy } = req.body;

  try {
    let imageUrl = '';
    let modelUrl = '';

    const files = req.files as {
      image?: Express.Multer.File[];
      model?: Express.Multer.File[];
    };

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

    res.status(201).json(newColor);
  } catch (error) {
    console.error('[addProductColor]', error);
    res.status(500).json({ error: 'Failed to create product color' });
  }
};

// PUT /product-colors/:id - Update product color
export const updateProductColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { colorId, productName, productId, updatedBy } = req.body;

  try {
    let updateData: any = { colorId, productId };

    const files = req.files as {
      image?: Express.Multer.File[];
      model?: Express.Multer.File[];
    };

    if (files?.image?.[0]) {
      const imageUrl = await uploadStreamToCloudinary(
        files.image[0].buffer,
        'productColors'
      );
      updateData.image = imageUrl;
    }

    if (files?.model?.[0]) {
      const modelUrl = await uploadStreamToCloudinary(
        files.model[0].buffer,
        'productModels'
      );
      updateData.model = modelUrl;
    }

    const updated = await prisma.productColor.update({
      where: { id },
      data: updateData,
    });

    await createJournalEntry(
      `ADMIN updated product color for product ${productName}`,
      updatedBy
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error('[updateProductColor]', err);
    res.status(500).json({ error: 'Failed to update product color' });
  }
};

// DELETE /product-colors/:id
export const deleteProductColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBy = req.body.deletedBy || 'Admin';
  const productName = req.body.productName;

  console.log(req.body);

  console.log(deletedBy, productName);

  try {
    const color = await prisma.productColor.findUnique({ where: { id } });

    if (!color)
      return res.status(404).json({ error: 'Product color not found' });

    await prisma.productColor.delete({ where: { id } });

    await createJournalEntry(
      `ADMIN deleted product color of product ${productName}`,
      deletedBy
    );

    res.status(200).json({ message: 'Product color deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product color' });
  }
};

// GET /product-colors/by-product/:productId
export const getProductColorsByProductId = async (
  req: Request,
  res: Response
) => {
  const { productId } = req.params;

  try {
    const productColors = await prisma.productColor.findMany({
      where: { productId },
      include: {
        color: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            type: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(productColors);
  } catch (error) {
    console.error('[getProductColorsByProductId]', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch product colors for this product' });
  }
};
