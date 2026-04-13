import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const customerSalt = await bcrypt.genSalt(10);
  const bartenderSalt = await bcrypt.genSalt(10);
  const adminSalt = await bcrypt.genSalt(10);
  let passwordHash = await bcrypt.hash('E9zJ#rG$%jSvgSP5&%3^', adminSalt);

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

  passwordHash = await bcrypt.hash('Yv9P$Ted#f2c7H$e', bartenderSalt);

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

  passwordHash = await bcrypt.hash('XYvZA!WQ2URQyk', customerSalt);

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

  console.log('📁 Creating categories...');
  const sandwiches = await prisma.category.upsert({ where: { slug: 'sandwiches' }, update: {}, create: { name: 'Szendvicsek & Wrapek', slug: 'sandwiches' } });
  const beverages = await prisma.category.upsert({ where: { slug: 'beverages' }, update: {}, create: { name: 'Italok & Kávék', slug: 'beverages' } });
  const snacks = await prisma.category.upsert({ where: { slug: 'snacks' }, update: {}, create: { name: 'Snackek & Desszertek', slug: 'snacks' } });
  const hotMeals = await prisma.category.upsert({ where: { slug: 'hotmeals' }, update: {}, create: { name: 'Meleg ételek', slug: 'hotmeals' } });

  console.log('🍔 Creating products...');

  const productsData = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Sonkás-Sajtos Toast',
      description: 'Ropogósra sütött toast kenyér prémium sonkával és olvadó cheddar sajttal.',
      price: 850, stockQuantity: 50, categoryId: sandwiches.id,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Csípős Szalámis Bagett',
      description: 'Frissen sült bagett, vajkrém, csípős szalámi, jégsaláta és paradicsom.',
      price: 950, stockQuantity: 30, categoryId: sandwiches.id,
      imageUrl: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=600'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Coca-Cola (0.5l)',
      description: 'Jéghideg félliteres kiszerelés.',
      price: 500, stockQuantity: 100, categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80'
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Dupla Espresso',
      description: 'Erős, frissen főzött 100% Arabica kávé.',
      price: 450, stockQuantity: 200, categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80'
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Csokis Cookie',
      description: 'Omlós keksz gazdag étcsokoládé darabokkal.',
      price: 350, stockQuantity: 40, categoryId: snacks.id,
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80'
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Kézműves Hot Dog',
      description: 'Ropogós kifli, roppanós virsli, pirított hagyma, mustár és ketchup.',
      price: 1200, stockQuantity: 25, categoryId: hotMeals.id,
      imageUrl: 'https://images.unsplash.com/photo-1612392062422-ef19b42f74df?w=600&q=80'
    },
    {
      id: '77777777-7777-7777-7777-777777777777',
      name: 'Vegán Wrap',
      description: 'Tortilla tekercs hummusszal, friss zöldségekkel és falafellel.',
      price: 1450, stockQuantity: 15, categoryId: sandwiches.id,
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80'
    },
    {
      id: '88888888-8888-8888-8888-888888888888',
      name: 'Friss Limonádé (0.5l)',
      description: 'Házi készítésű citromos-mentás limonádé sok jéggel.',
      price: 750, stockQuantity: 50, categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80'
    },
    {
      id: '99999999-9999-9999-9999-999999999999',
      name: 'Sajtszószos Nachos',
      description: 'Nagy adag tortilla chips meleg jalapeños sajtszósszal.',
      price: 1100, stockQuantity: 20, categoryId: snacks.id,
      imageUrl: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=600&q=80'
    },
    {
      id: '12345678-1234-1234-1234-123456789101',
      name: 'Cappuccino',
      description: 'Espresso bőséges, krémes tejhabbal a tetején.',
      price: 650, stockQuantity: 150, categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80'
    }
  ];

  // Upsert all products
  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        imageUrl: prod.imageUrl,
        name: prod.name,
        price: prod.price,
        description: prod.description
      },
      create: prod,
    });
  }

  console.log('Creating dummy orders...');

  const existingOrders = await prisma.order.count({ where: { userId: customer.id } });

  if (existingOrders === 0) {
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    await prisma.order.create({
      data: {
        userId: customer.id, status: 'COMPLETED', totalAmount: 1350, handledById: bartender.id, createdAt: d1,
        items: { create: [ { productId: productsData[0].id, quantity: 1, unitPriceAtPurchase: 850 }, { productId: productsData[2].id, quantity: 1, unitPriceAtPurchase: 500 } ] },
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'COMPLETED', totalAmount: 2300, handledById: bartender.id,
        items: { create: [ { productId: productsData[5].id, quantity: 1, unitPriceAtPurchase: 1200 }, { productId: productsData[8].id, quantity: 1, unitPriceAtPurchase: 1100 } ] },
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'PREPARING', totalAmount: 1850, handledById: bartender.id,
        items: { create: [ { productId: productsData[1].id, quantity: 1, unitPriceAtPurchase: 950 }, { productId: productsData[3].id, quantity: 2, unitPriceAtPurchase: 450 } ] },
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'NEW', totalAmount: 1450,
        items: { create: [ { productId: productsData[6].id, quantity: 1, unitPriceAtPurchase: 1450 } ] },
      },
    });
  }

  console.log('Setting up favorites...');
  await prisma.favorite.upsert({
    where: { userId_productId: { userId: customer.id, productId: productsData[0].id } },
    update: {}, create: { userId: customer.id, productId: productsData[0].id },
  });
  await prisma.favorite.upsert({
    where: { userId_productId: { userId: customer.id, productId: productsData[7].id } },
    update: {}, create: { userId: customer.id, productId: productsData[7].id },
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