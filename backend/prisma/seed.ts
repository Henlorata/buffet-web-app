import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123', salt);

  console.log('Creating users...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@buffet.com' },
    update: {},
    create: {
      email: 'admin@buffet.com',
      fullName: 'System Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const bartender = await prisma.user.upsert({
    where: { email: 'bartender@buffet.com' },
    update: {},
    create: {
      email: 'bartender@buffet.com',
      fullName: 'Bob Bartender',
      passwordHash,
      role: 'BARTENDER',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@buffet.com' },
    update: {},
    create: {
      email: 'customer@buffet.com',
      fullName: 'Alice Customer',
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  console.log('Creating categories...');
  const sandwiches = await prisma.category.upsert({
    where: { slug: 'sandwiches' },
    update: {},
    create: { name: 'Sandwiches', slug: 'sandwiches' },
  });

  const beverages = await prisma.category.upsert({
    where: { slug: 'beverages' },
    update: {},
    create: { name: 'Beverages', slug: 'beverages' },
  });

  const snacks = await prisma.category.upsert({
    where: { slug: 'snacks' },
    update: {},
    create: { name: 'Snacks & Desserts', slug: 'snacks' },
  });

  console.log('Creating products...');
  const product1 = await prisma.product.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Ham & Cheese Toast',
      description: 'Crispy baked toast with premium ham and melted cheddar cheese.',
      price: 850,
      stockQuantity: 50,
      categoryId: sandwiches.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Spicy Salami Baguette',
      description: 'Freshly baked baguette with butter, spicy salami, iceberg lettuce, and tomatoes.',
      price: 950,
      stockQuantity: 30,
      categoryId: sandwiches.id,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: '33333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Coca-Cola (0.5l)',
      description: 'Chilled half-liter bottle.',
      price: 500,
      stockQuantity: 100,
      categoryId: beverages.id,
    },
  });

  const product4 = await prisma.product.upsert({
    where: { id: '44444444-4444-4444-4444-444444444444' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Double Espresso',
      description: 'Strong, freshly brewed 100% Arabica coffee.',
      price: 450,
      stockQuantity: 200,
      categoryId: beverages.id,
    },
  });

  const product5 = await prisma.product.upsert({
    where: { id: '55555555-5555-5555-5555-555555555555' },
    update: {},
    create: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Chocolate Chip Cookie',
      description: 'Soft-baked cookie with rich dark chocolate chunks.',
      price: 350,
      stockQuantity: 40,
      categoryId: snacks.id,
    },
  });

  console.log('Creating dummy orders...');

  const existingOrders = await prisma.order.count({ where: { userId: customer.id } });

  if (existingOrders === 0) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'COMPLETED',
        totalAmount: 1350,
        handledById: bartender.id,
        items: {
          create: [
            { productId: product1.id, quantity: 1, unitPriceAtPurchase: 850 },
            { productId: product3.id, quantity: 1, unitPriceAtPurchase: 500 },
          ],
        },
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'NEW',
        totalAmount: 1850,
        items: {
          create: [
            { productId: product2.id, quantity: 1, unitPriceAtPurchase: 950 },
            { productId: product4.id, quantity: 2, unitPriceAtPurchase: 450 },
          ],
        },
      },
    });
  }

  console.log('Setting up favorites...');
  await prisma.favorite.upsert({
    where: {
      userId_productId: {
        userId: customer.id,
        productId: product1.id,
      },
    },
    update: {},
    create: {
      userId: customer.id,
      productId: product1.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });