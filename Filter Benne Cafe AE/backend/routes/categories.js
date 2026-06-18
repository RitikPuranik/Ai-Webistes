const express = require('express');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/categories — public, returns all categories sorted by sortOrder
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// POST /api/categories — admin only, create a new category
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists.' });
    }

    // Set sortOrder to be after the last category
    const maxOrder = await Category.findOne().sort({ sortOrder: -1 });
    const sortOrder = maxOrder ? maxOrder.sortOrder + 1 : 0;

    const category = new Category({
      name: name.trim(),
      sortOrder,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

// DELETE /api/categories/:id — admin only, delete a category (only if empty)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Check if any menu items use this category
    const itemCount = await MenuItem.countDocuments({ category: category._id });
    if (itemCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category. It still has ${itemCount} item${itemCount === 1 ? '' : 's'}. Remove those items first.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

// PUT /api/categories/reorder — admin only, reorder categories
// Body: { orderedIds: ['id1', 'id2', 'id3', ...] }
router.put('/reorder', auth, async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ error: 'orderedIds array is required.' });
    }

    // Bulk update sortOrder for each category
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index } },
      },
    }));

    await Category.bulkWrite(bulkOps);

    const categories = await Category.find().sort({ sortOrder: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Reorder categories error:', err);
    res.status(500).json({ error: 'Failed to reorder categories.' });
  }
});

module.exports = router;
