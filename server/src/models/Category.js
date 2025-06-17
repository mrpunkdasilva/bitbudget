import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isExpense: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Category;