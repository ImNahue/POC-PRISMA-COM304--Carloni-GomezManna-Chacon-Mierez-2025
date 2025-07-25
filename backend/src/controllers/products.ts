import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  const { category, minPrice, maxPrice, inStock } = req.query;
  
  const filters: any = {};
  
  if (category) filters.categoryId = parseInt(category as string);
  if (minPrice) filters.price = { gte: parseFloat(minPrice as string) };
  if (maxPrice) filters.price = { ...filters.price, lte: parseFloat(maxPrice as string) };
  if (inStock === 'true') filters.stock = { gt: 0 };
  
  try {
    const products = await prisma.product.findMany({
      where: filters,
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId)
      },
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId)
      },
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

// Special queries
export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category' });
  }
};

export const getOutOfStockProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { equals: 0 } },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching out of stock products' });
  }
};

export const getExpensiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { price: { gt: 100 } }, // Products more expensive than 100
      include: { category: true },
      orderBy: { price: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expensive products' });
  }
};