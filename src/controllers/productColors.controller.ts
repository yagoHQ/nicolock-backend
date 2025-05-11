import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadStreamToCloudinary } from '../utils/cloudinary';

const prisma = new PrismaClient();

// GET all product colors
export const getAllProductColors = async (_req: Request, res: Response) => {
  try {
    const colors = await prisma.productColor.findMany({
      include: {
        color: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            image: true,
            name: true,
            type: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(colors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product colors' });
  }
};

//add product color
export const addProductColor = async (req: Request, res: Response) => {
  const { productId, colorId } = req.body;

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

    res.status(201).json(newColor);
  } catch (error) {
    console.error('[addProductColor]', error);
    res.status(500).json({ error: 'Failed to create product color' });
  }
};

// UPDATE product color
export const updateProductColor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { colorId, productId } = req.body;

  try {
    let updateData: any = { colorId, productId };

    if (req.files && 'image' in req.files) {
      const imageBuffer = (req.files as any).image[0].buffer;
      const imageUrl = await uploadStreamToCloudinary(
        imageBuffer,
        'productColors'
      );
      updateData.image = imageUrl;
    }

    if (req.files && 'model' in req.files) {
      const modelBuffer = (req.files as any).model[0].buffer;
      const modelUrl = await uploadStreamToCloudinary(
        modelBuffer,
        'productModels'
      );
      updateData.model = modelUrl;
    }

    const updated = await prisma.productColor.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('[updateProductColor]', err);
    res.status(500).json({ error: 'Failed to update product color' });
  }
};

// DELETE product color
export const deleteProductColor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.productColor.delete({ where: { id } });
    res.status(200).json({ message: 'Product color deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product color' });
  }
};

//GET product colors by product ID
export const getProductColorsByProductId = async (
  req: Request,
  res: Response
) => {
  const { productId } = req.params;

  try {
    const productColors = await prisma.productColor.findMany({
      where: {
        productId,
      },
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
