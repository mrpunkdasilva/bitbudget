import User from './User.js';
import Category from './Category.js';
import Transaction from './Transaction.js';
import Web3Asset from './Web3Asset.js';
import AiRecommendation from './AiRecommendation.js';

// Define relationships
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Transaction, { foreignKey: 'categoryId' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Web3Asset, { foreignKey: 'userId', onDelete: 'CASCADE' });
Web3Asset.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AiRecommendation, { foreignKey: 'userId', onDelete: 'CASCADE' });
AiRecommendation.belongsTo(User, { foreignKey: 'userId' });

export {
  User,
  Category,
  Transaction,
  Web3Asset,
  AiRecommendation
};