const express = require('express');
const app = express();

// Middleware d'enregistrement des requêtes
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// Exporter le middleware pour les tests
module.exports = requestLogger;

// Utilisation du middleware pour toutes les requêtes
app.use(requestLogger);

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur la page d\'accueil !');
});

const PORT = 80;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Le serveur Express écoute sur le port ${PORT}`);
  });
}
