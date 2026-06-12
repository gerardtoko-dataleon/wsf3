const request = require('supertest');
const { expect } = require('chai');
const app = require('./app');
const User = require('./User');
const sequelize = require('./sequelize');

describe('Sequelize App Routes', () => {
  
  before(async () => {
    // S'assurer que la connexion est ouverte et synchroniser la base de données
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  });

  afterEach(async () => {
    // Nettoyer la base de données après chaque test
    try {
      await User.destroy({ where: {} });
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  });

  after(async () => {
    // Fermer la connexion après tous les tests
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Erreur lors de la fermeture:', error);
    }
  });

  describe('POST /users', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123' // Ajouter un mot de passe pour respecter la validation du modèle
        });
      
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.equal('John Doe');
      expect(response.body.email).to.equal('john@example.com');
    });

    it('devrait retourner une erreur avec email manquant', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'John Doe'
        });
      
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('devrait empêcher les emails en doublon', async () => {
      // Créer le premier utilisateur
      await request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123' // Ajouter un mot de passe pour respecter la validation du modèle
        });

      // Essayer de créer un utilisateur avec le même email
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'john@example.com'
        });
      
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });
  });

  describe('GET /users', () => {
    it('devrait retourner une liste vide au départ', async () => {
      const response = await request(app).get('/users');
      
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(0);
    });

    it('devrait retourner les utilisateurs créés', async () => {
      // Créer deux utilisateurs
      await User.create({ name: 'User 1', email: 'user1@example.com', password: 'password123' });
      await User.create({ name: 'User 2', email: 'user2@example.com', password: 'password123' });

      const response = await request(app).get('/users');
      
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(response.body[0].name).to.equal('User 1');
      expect(response.body[1].name).to.equal('User 2');
    });
  });

  describe('User flow', () => {
    it('sign up', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });
      
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.equal('John Doe');
      expect(response.body.email).to.equal('john@example.com');
    });

    it('sign up should fail with missing email', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          name: 'John Doe',
        });
      
      expect(response.status).to.equal(400);
    });
  });
});
