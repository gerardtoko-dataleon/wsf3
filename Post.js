const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Post = sequelize.define('Post', {
  // Définition des colonnes de la table Post
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  // Options du modèle
  timestamps: true, // Si vous voulez des timestamps (createdAt, updatedAt)
  tableName: 'posts' // Nom de la table dans la base de données
});

module.exports = Post;
