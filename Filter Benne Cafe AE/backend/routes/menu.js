const express = require('express');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Default images by category name
const categoryDefaultImages = {
  Signature: '/assets/rec_ghee_podi_dosa.jpg',
  Idli: '/assets/rec_thatte_idli.jpg',
  Dosa: '/assets/rec_ghee_podi_dosa.jpg',
  'Benne Dosas': '/assets/rec_ghee_podi_dosa.jpg',
  Uttapams: '/assets/food_spread.png',
  Vada: '/assets/food_spread.png',
  Beverages: '/assets/food_spread.png',
  Rice: '/assets/rec_bisi_bele_bhath.jpg',
  Sweet: '/assets/rec_kesari_baat.jpg',
};

function getDefaultImageForCategory(categoryName) {
  return categoryDefaultImages[categoryName] || '/assets/food_spread.png';
}

// GET /api/menu — public, returns all menu items with category populated, sorted
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate('category', 'name sortOrder')
      .sort({ sortOrder: 1 });

    // Transform: replace category ObjectId with category name for frontend compatibility
    const transformed = items.map(item => ({
      _id: item._id,
      id: item._id.toString(),
      name: item.name,
      price: item.price,
      category: item.category ? item.category.name : 'Uncategorized',
      categoryId: item.category ? item.category._id : null,
      categorySortOrder: item.category ? item.category.sortOrder : 999,
      description: item.description,
      image: item.image,
      tag: item.tag,
      sortOrder: item.sortOrder,
    }));

    // Sort by category sortOrder first, then item sortOrder
    transformed.sort((a, b) => {
      if (a.categorySortOrder !== b.categorySortOrder) {
        return a.categorySortOrder - b.categorySortOrder;
      }
      return a.sortOrder - b.sortOrder;
    });

    res.json(transformed);
  } catch (err) {
    console.error('Get menu items error:', err);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// POST /api/menu — admin only, create a new menu item
router.post('/', auth, async (req, res) => {
  try {
    const { name, price, categoryId, description, tag } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price, and categoryId are required.' });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Set sortOrder to be after the last item in this category
    const maxOrderItem = await MenuItem.findOne({ category: categoryId }).sort({ sortOrder: -1 });
    const sortOrder = maxOrderItem ? maxOrderItem.sortOrder + 1 : 0;

    const image = getDefaultImageForCategory(category.name);

    const menuItem = new MenuItem({
      name: name.trim(),
      price: price.trim(),
      category: categoryId,
      description: description || '',
      tag: tag || '',
      image,
      sortOrder,
    });

    await menuItem.save();

    // Return with category name for frontend
    res.status(201).json({
      _id: menuItem._id,
      id: menuItem._id.toString(),
      name: menuItem.name,
      price: menuItem.price,
      category: category.name,
      categoryId: category._id,
      description: menuItem.description,
      image: menuItem.image,
      tag: menuItem.tag,
      sortOrder: menuItem.sortOrder,
    });
  } catch (err) {
    console.error('Create menu item error:', err);
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// DELETE /api/menu/:id — admin only, delete a menu item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    console.error('Delete menu item error:', err);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

// PUT /api/menu/reorder — admin only, reorder menu items
// Body: { orderedIds: ['id1', 'id2', 'id3', ...] }
router.put('/reorder', auth, async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ error: 'orderedIds array is required.' });
    }

    // Bulk update sortOrder for each item
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index } },
      },
    }));

    await MenuItem.bulkWrite(bulkOps);

    res.json({ message: 'Menu items reordered.' });
  } catch (err) {
    console.error('Reorder menu items error:', err);
    res.status(500).json({ error: 'Failed to reorder menu items.' });
  }
});

module.exports = router;
