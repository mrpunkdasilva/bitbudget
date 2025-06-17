import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Web3Asset = sequelize.define('Web3Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tokenAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tokenType: {
    type: DataTypes.ENUM('NATIVE', 'ERC20', 'ERC721', 'ERC1155'),
    allowNull: false,
    defaultValue: 'NATIVE'
  },
  network: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ethereum'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Web3Asset;