import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  const { category, minPrice, maxPrice, inStock } = req.query;

  const filters: any = {};

  if (category === 'none') {
    filters.categoryId = null;
  } else if (category) {
    filters.categoryId = parseInt(category as string);
  }
  if (minPrice) filters.price = { gte: parseFloat(minPrice as string) };
  if (maxPrice) filters.price = { ...filters.price, lte: parseFloat(maxPrice as string) };

  // Manejar filtro de stock con tres opciones
  if (inStock === 'true') {
    filters.stock = { gt: 0 }; // En stock (stock > 0)
  } else if (inStock === 'false') {
    filters.stock = { equals: 0 }; // Sin stock (stock = 0)
  }
  // Si inStock no se proporciona o está vacío, mostrar todos los productos (sin filtro de stock)

  try {
    const products = await prisma.product.findMany({
      where: filters,
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
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
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const data: any = { name };

  if (description !== undefined) {
    data.description = description;
  }

  if (price !== undefined && price !== '') {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Precio inválido' });
    }
    data.price = parsedPrice;
  }

  if (stock !== undefined && stock !== '') {
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock)) {
      return res.status(400).json({ error: 'Stock inválido' });
    }
    data.stock = parsedStock;
  }

  if (categoryId !== undefined && categoryId !== '') {
    if (categoryId === 'none') {
      data.categoryId = null;
    } else {
      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) {
        return res.status(400).json({ error: 'categoryId inválido' });
      }
      data.categoryId = parsedCategoryId;
    }
  }

  try {
    const product = await prisma.product.create({
      data,
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId } = req.body;

  const data: any = {};

  if (name !== undefined && name !== '') {
    data.name = name;
  }

  if (description !== undefined) {
    data.description = description;
  }

  if (price !== undefined && price !== '') {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Precio inválido' });
    }
    data.price = parsedPrice;
  }

  if (stock !== undefined && stock !== '') {
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock)) {
      return res.status(400).json({ error: 'Stock inválido' });
    }
    data.stock = parsedStock;
  }

  if (categoryId !== undefined && categoryId !== '') {
    if (categoryId === 'none') {
      data.categoryId = null;
    } else {
      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) {
        return res.status(400).json({ error: 'categoryId inválido' });
      }
      data.categoryId = parsedCategoryId;
    }
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
  }

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
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
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Consultas especiales
export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
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
    res.status(500).json({ error: 'Error al obtener productos sin stock' });
  }
};

export const getExpensiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { price: { gt: 100 } }, // Productos con precio mayor a 100
      include: { category: true },
      orderBy: { price: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos caros' });
  }
};

// Operaciones masivas
export const bulkDeleteProducts = async (req: Request, res: Response) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Se requieren IDs de productos válidos' });
  }

  try {
    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds.map((id: any) => parseInt(id))
        }
      }
    });

    res.json({
      message: `${result.count} producto(s) eliminado(s) correctamente`,
      deletedCount: result.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando productos' });
  }
};
