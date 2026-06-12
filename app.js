// app.js (ou où vous définissez votre application Express)
const express = require('express');
const app = express();
const User = require('./User'); // Importer le modèle Sequelize
const md5 = require('md5'); // Assurez-vous d'installer md5 avec npm install md5

app.use(express.json());

const hashPassword = (password) => {
  // use md5
  newPassword = password + 'salt'; // Ajouter un sel pour renforcer la sécurité
  return md5(newPassword); // Remplacez ceci par le mot de passe haché
}

// Route pour créer un utilisateur
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const passwordEncrypted = hashPassword(password); // Implémentez cette fonction pour chiffrer les mots de passe
  try {
    const user = await User.create({ name, email, password: passwordEncrypted }); // Vous pouvez gérer les mots de passe plus tard
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordEncrypted = hashPassword(password);
  try {
    const user = await User.create({ name, email, password: passwordEncrypted });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Autres routes CRUD (GET par ID, PUT, DELETE) similaires...

// Exporter l'app pour les tests
module.exports = app;

// Lancer le serveur seulement si ce fichier est exécuté directement
if (require.main === module) {
  const PORT = 80;
  app.listen(PORT, () => {
    console.log(`Le serveur Express écoute sur le port ${PORT}`);
  });
}
