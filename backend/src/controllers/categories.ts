import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
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
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    // Verificar si el nombre ya existe
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });
    if (existingCategory) {
      return res.status(400).json({ error: 'El nombre de la categoría ya existe' });
    }

    // Encontrar el ID máximo y asignar el siguiente ID
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
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    // Verificar si el nombre ya existe para otra categoría
    const existingCategory = await prisma.category.findFirst({
      where: { name, id: { not: parseInt(id) } }
    });
    if (existingCategory) {
      return res.status(400).json({ error: 'El nombre de la categoría ya existe' });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Verificar si la categoría tiene productos
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    });

    if (!categoryWithProducts) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Si tiene productos, establecer su categoryId en null
    if (categoryWithProducts.product.length > 0) {
      await prisma.product.updateMany({
        where: { categoryId: parseInt(id) },
        data: { categoryId: null }
      });
    }

    // Eliminar la categoría
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};

export const resetDatabase = async (req: Request, res: Response) => {
  try {
    // Ejecutar SQL bruto para desactivar temporalmente las comprobaciones de claves foráneas
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

    // Eliminar todos los productos y categorías
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Reiniciar los índices de auto-incremento
    await prisma.$executeRaw`ALTER TABLE product AUTO_INCREMENT = 1;`;
    await prisma.$executeRaw`ALTER TABLE category AUTO_INCREMENT = 1;`;

    // Volver a habilitar las comprobaciones de claves foráneas
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

    res.status(200).json({ message: 'Base de datos reiniciada correctamente' });
  } catch (error) {
    console.error('Error al reiniciar la base de datos:', error);
    // Asegurarse de volver a habilitar las claves foráneas incluso si hay un error
    try {
      await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    } catch (fkError) {
      console.error('Error al volver a habilitar las claves foráneas:', fkError);
    }
    res.status(500).json({ error: 'Error al reiniciar la base de datos' });
  }
};