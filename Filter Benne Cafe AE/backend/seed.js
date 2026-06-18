const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');

const defaultCategories = [
  'Signature',
  'Benne Dosas',
  'Uttapams',
  'Rice',
  'Idli',
  'Vada',
  'Beverages',
  'Sweet',
  'Breakfast Special',
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} categories. Skipping seed.`);
      console.log('To re-seed, drop the categories collection first.');
      process.exit(0);
    }

    // Create default categories with sortOrder
    const categories = defaultCategories.map((name, index) => ({
      name,
      sortOrder: index,
    }));

    await Category.insertMany(categories);
    console.log(`✓ Seeded ${categories.length} default categories:`);
    categories.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.name}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('✗ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
