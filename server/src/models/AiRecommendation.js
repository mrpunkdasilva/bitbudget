import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AiRecommendation = sequelize.define('AiRecommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('SAVING', 'INVESTMENT', 'BUDGET', 'GENERAL'),
    allowNull: false,
    defaultValue: 'GENERAL'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default AiRecommendation;