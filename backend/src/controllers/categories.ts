import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    // Check if name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    // Find the max ID and set next ID
    const maxIdResult = await prisma.category.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    const nextId = maxIdResult ? maxIdResult.id + 1 : 1;

    const category = await prisma.category.create({
      data: { id: nextId, name, description }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    // Check if name already exists for another category
    const existingCategory = await prisma.category.findFirst({
      where: { name, id: { not: parseInt(id) } }
    });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Check if category has products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    });

    if (!categoryWithProducts) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If has products, set their categoryId to null
    if (categoryWithProducts.product.length > 0) {
      await prisma.product.updateMany({
        where: { categoryId: parseInt(id) },
        data: { categoryId: null }
      });
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

export const resetDatabase = async (req: Request, res: Response) => {
  try {
    // Execute raw SQL to temporarily disable foreign key checks
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

    // Delete all products and categories
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Reset auto-increment indexes
    await prisma.$executeRaw`ALTER TABLE product AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE category AUTO_INCREMENT = 1;`;

    // Re-enable foreign key checks
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    // Make sure to re-enable foreign key checks even if there's an error
    try {
      await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    } catch (fkError) {
      console.error('Error re-enabling foreign key checks:', fkError);
    }
    res.status(500).json({ error: 'Error resetting database' });
  }
};
