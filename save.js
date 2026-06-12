const User = require('./User'); // Importer le modèle User que nous avons défini

// Fonction pour créer un utilisateur
async function createUser(name, email) {
  try {
    const user = await User.create({ name, email });
    console.log('Utilisateur créé avec succès:', user.toJSON());
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  }
}

// Fonction pour récupérer tous les utilisateurs
async function getAllUsers() {
  try {
    const users = await User.findAll();
    console.log('Tous les utilisateurs :', users.map(user => user.toJSON()));
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
  }
}

// Fonction pour récupérer un utilisateur par son ID
async function getUserById(id) {
  try {
    const user = await User.findByPk(id);
    if (user) {
      console.log('Utilisateur trouvé:', user.toJSON());
    } else {
      console.log('Aucun utilisateur trouvé avec cet ID.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  }
}

// Fonction pour mettre à jour un utilisateur par son ID
async function updateUser(id, newName, newEmail) {
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.name = newName;
      user.email = newEmail;
      await user.save();
      console.log('Utilisateur mis à jour avec succès:', user.toJSON());
    } else {
      console.log('Aucun utilisateur trouvé avec cet ID.');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
  }
}

// Fonction pour supprimer un utilisateur par son ID
async function deleteUser(id) {
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      console.log('Utilisateur supprimé avec succès.');
    } else {
      console.log('Aucun utilisateur trouvé avec cet ID.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
  }
}

// Exporter les fonctions
module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };

// Exemples d'utilisation des fonctions CRUD (seulement si ce fichier est exécuté directement)
if (require.main === module) {
  createUser('John Doe', 'john@example.com');
  getAllUsers();
  getUserById(1);
  updateUser(1, 'Jane Doe', 'jane@example.com');
  deleteUser(1);
}
