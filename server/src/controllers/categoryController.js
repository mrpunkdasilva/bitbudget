import { Category } from '../models/index.js';

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a category by ID
// @route   GET /api/categories/:id
// @access  Private
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name, title, color, isExpense } = req.body;

    const category = await Category.create({
      name,
      title,
      color,
      isExpense,
      userId: req.user.id
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { name, title, color, isExpense } = req.body;

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (category) {
      category.name = name || category.name;
      category.title = title || category.title;
      category.color = color || category.color;
      category.isExpense = isExpense !== undefined ? isExpense : category.isExpense;

      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (category) {
      await category.destroy();
      res.status(200).json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};