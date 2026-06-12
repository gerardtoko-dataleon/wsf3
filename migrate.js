const sequelize = require('./sequelize');
const User = require('./User');

async function createTable() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');

    await User.sync({ force: true });
    console.log('La table "users" a été créée avec succès.');

    await sequelize.close();
    console.log('Connexion à la base de données fermée.');
  } catch (error) {
    console.error('Erreur lors de la création de la table :', error);
  }
}

// Exécuter seulement si ce fichier est appelé directement
if (require.main === module) {
  createTable();
}

module.exports = { createTable };
