// app.js (ou où vous définissez votre application Express)
const express = require('express');
const app = express();
const User = require('./User'); // Importer le modèle Sequelize

app.use(express.json());

// Route pour créer un utilisateur
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
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
