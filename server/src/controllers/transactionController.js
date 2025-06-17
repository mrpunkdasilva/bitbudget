import { Transaction, Category } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get all transactions for a user
// @route   GET /api/expenses
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { month, year, type } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    // Filter by transaction type (expense or income)
    if (type) {
      const categories = await Category.findAll({
        where: {
          userId: req.user.id,
          isExpense: type === 'expense'
        },
        attributes: ['id']
      });
      
      const categoryIds = categories.map(cat => cat.id);
      
      whereClause.categoryId = {
        [Op.in]: categoryIds
      };
    }
    
    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          attributes: ['name', 'title', 'color', 'isExpense']
        }
      ],
      order: [['date', 'DESC']]
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a transaction by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Category,
          attributes: ['name', 'title', 'color', 'isExpense']
        }
      ]
    });
    
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new transaction
// @route   POST /api/expenses
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, date, description, categoryId } = req.body;
    
    // Verify that the category belongs to the user
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    const transaction = await Transaction.create({
      title,
      amount,
      date: new Date(date),
      description,
      categoryId,
      userId: req.user.id
    });
    
    // Fetch the created transaction with category details
    const createdTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: Category,
          attributes: ['name', 'title', 'color', 'isExpense']
        }
      ]
    });
    
    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/expenses/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const { title, amount, date, description, categoryId } = req.body;
    
    // If categoryId is provided, verify that it belongs to the user
    if (categoryId) {
      const category = await Category.findOne({
        where: {
          id: categoryId,
          userId: req.user.id
        }
      });
      
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }
    
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (transaction) {
      transaction.title = title || transaction.title;
      transaction.amount = amount !== undefined ? amount : transaction.amount;
      transaction.date = date ? new Date(date) : transaction.date;
      transaction.description = description !== undefined ? description : transaction.description;
      transaction.categoryId = categoryId || transaction.categoryId;
      
      const updatedTransaction = await transaction.save();
      
      // Fetch the updated transaction with category details
      const result = await Transaction.findByPk(updatedTransaction.id, {
        include: [
          {
            model: Category,
            attributes: ['name', 'title', 'color', 'isExpense']
          }
        ]
      });
      
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (transaction) {
      await transaction.destroy();
      res.status(200).json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get transaction summary by month
// @route   GET /api/expenses/summary
// @access  Private
export const getTransactionSummary = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    // Get all categories for the user
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'name', 'title', 'isExpense']
    });
    
    const expenseCategories = categories.filter(cat => cat.isExpense).map(cat => cat.id);
    const incomeCategories = categories.filter(cat => !cat.isExpense).map(cat => cat.id);
    
    // Initialize summary data
    const monthlySummary = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      // Get total expenses for the month
      const expenses = await Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          categoryId: { [Op.in]: expenseCategories },
          date: { [Op.between]: [startDate, endDate] }
        }
      });
      
      // Get total income for the month
      const income = await Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          categoryId: { [Op.in]: incomeCategories },
          date: { [Op.between]: [startDate, endDate] }
        }
      });
      
      monthlySummary.push({
        month: month + 1,
        monthName: new Date(currentYear, month, 1).toLocaleString('default', { month: 'long' }),
        income: income || 0,
        expenses: expenses || 0,
        balance: (income || 0) - (expenses || 0)
      });
    }
    
    res.status(200).json(monthlySummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};