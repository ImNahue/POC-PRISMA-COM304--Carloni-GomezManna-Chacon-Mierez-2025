/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // (agregando id manual)
  const category1 = await prisma.category.create({
    data: {
      id: 1,
      name: 'Snacks',
      description: 'Snacks y aperitivos'
    }
  });

  const category2 = await prisma.category.create({
    data: {
      id: 2,
      name: 'Bebidas',
      description: 'Bebidas refrescantes'
    }
  });

  const category3 = await prisma.category.create({
    data: {
      id: 3,
      name: 'Dulces',
      description: 'Chocolates y golosinas'
    }
  });

  const category4 = await prisma.category.create({
    data: {
      id: 4,
      name: 'Panadería',
      description: 'Productos de panadería'
    }
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Papas Fritas',
        description: 'Bolsa de papas fritas 200g',
        price: 2500.00,
        stock: 100,
        categoryId: category1.id
      },
      {
        name: 'Gaseosa Cola',
        description: 'Gaseosa de cola 2L',
        price: 2800.00,
        stock: 50,
        categoryId: category2.id
      },
      {
        name: 'Chocolate',
        description: 'Barra de chocolate con leche',
        price: 3000.00,
        stock: 200,
        categoryId: category3.id
      },
      {
        name: 'Pan Integral',
        description: 'Pan integral fresco',
        price: 1200.00,
        stock: 80,
        categoryId: category4.id
      },
      {
        name: 'Galletas',
        description: 'Galletas de vainilla',
        price: 850.00,
        stock: 60,
        categoryId: category1.id
      },
      {
        name: 'Jugo de Naranja',
        description: 'Jugo de naranja natural',
        price: 1500.00,
        stock: 40,
        categoryId: category2.id
      },
      {
        name: 'Caramelos',
        description: 'Bolsa de caramelos surtidos',
        price: 1600.00,
        stock: 150,
        categoryId: category3.id
      },
      {
        name: 'Torta',
        description: 'Torta de chocolate',
        price: 20000.00,
        stock: 20,
        categoryId: category4.id
      }
    ]
  });

  console.log('Datos iniciales cargados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
