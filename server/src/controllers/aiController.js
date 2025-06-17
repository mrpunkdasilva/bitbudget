import { Transaction, Category, AiRecommendation } from '../models/index.js';
import { Op } from 'sequelize';
import { generateFinancialAdvice } from '../services/aiService.js';

// @desc    Get AI recommendations for a user
// @route   GET /api/ai/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const recommendations = await AiRecommendation.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    res.status(200).json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Generate new AI recommendation
// @route   POST /api/ai/generate-recommendation
// @access  Private
export const generateRecommendation = async (req, res) => {
  try {
    // Get user's financial data for the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    // Get all transactions
    const transactions = await Transaction.findAll({
      where: {
        userId: req.user.id,
        date: { [Op.gte]: threeMonthsAgo }
      },
      include: [
        {
          model: Category,
          attributes: ['name', 'title', 'isExpense']
        }
      ],
      order: [['date', 'DESC']]
    });
    
    // Calculate total income and expenses
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};
    
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      const category = transaction.Category;
      
      if (category.isExpense) {
        totalExpenses += amount;
        
        // Track category totals
        if (!categoryTotals[category.name]) {
          categoryTotals[category.name] = {
            title: category.title,
            isExpense: true,
            total: 0
          };
        }
        categoryTotals[category.name].total += amount;
      } else {
        totalIncome += amount;
        
        // Track category totals
        if (!categoryTotals[category.name]) {
          categoryTotals[category.name] = {
            title: category.title,
            isExpense: false,
            total: 0
          };
        }
        categoryTotals[category.name].total += amount;
      }
    });
    
    // Prepare financial context for AI
    const financialContext = {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      categoryBreakdown: categoryTotals,
      transactionCount: transactions.length,
      timeframe: '3 months'
    };
    
    // Generate AI recommendation
    const advice = await generateFinancialAdvice(financialContext);
    
    // Save recommendation to database
    const recommendation = await AiRecommendation.create({
      title: advice.title,
      content: advice.content,
      type: advice.type,
      userId: req.user.id
    });
    
    res.status(201).json(recommendation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark recommendation as read
// @route   PUT /api/ai/recommendations/:id/read
// @access  Private
export const markRecommendationAsRead = async (req, res) => {
  try {
    const recommendation = await AiRecommendation.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    
    recommendation.isRead = true;
    await recommendation.save();
    
    res.status(200).json({ message: 'Recommendation marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};