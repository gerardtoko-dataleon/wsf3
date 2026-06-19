// app.js (ou où vous définissez votre application Express)
const express = require('express');
const app = express();
const User = require('./User'); // Importer le modèle Sequelize
const Session = require('./Session'); // Importer le modèle de session
const Post = require('./Post'); // Importer le modèle de session
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordEncrypted = hashPassword(password);
  if (user.password !== passwordEncrypted) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Générer un token de session (vous pouvez utiliser une bibliothèque comme uuid ou crypto)
  const token = require('crypto').randomBytes(64).toString('hex');
  const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // Expiration dans 1 heure

  // Créer une session dans la base de données
  await Session.create({ token, expirationDate, userId: user.id });

  res.json({ token, expirationDate });
});

app.post('/logout', async (req, res) => {
  const {token } = req.body;
  const session = await Session.findOne({ where: { token } });
  if (!session) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  session.destroy();
  res.json({ message: 'Logged out successfully' });
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

app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const token = req.headers['authorization'];
  // Vérifier si le token est présent
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  // Vérifier si le token est valide et récupérer l'utilisateur associé
  const session = await Session.findOne({ where: { token } });
  if (!session) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const userId = session.userId;

  // Vérifier si l'utilisateur existe
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  try {
    // Créer le post avec l'ID de l'utilisateur associé
    const post = await Post.create({ title, content, userId });
    res.status(201).json(post);
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
