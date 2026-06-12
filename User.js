const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  // Définition des colonnes de la table User
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  // Options du modèle
  timestamps: true, // Si vous voulez des timestamps (createdAt, updatedAt)
  tableName: 'users' // Nom de la table dans la base de données
});

module.exports = User;
