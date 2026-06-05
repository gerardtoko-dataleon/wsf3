const request = require('supertest');
const { expect } = require('chai');
const express = require('express');

// Importer le middleware
const requestLogger = require('./middleware_log');

describe('Middleware Log', () => {
  let app;

  beforeEach(() => {
    // Créer une nouvelle app Express pour chaque test
    app = express();
    app.use(requestLogger);
    app.get('/test', (req, res) => {
      res.send('Test OK');
    });
  });

  it('devrait accepter une requête GET', async () => {
    const response = await request(app).get('/test');
    expect(response.status).to.equal(200);
    expect(response.text).to.include('Test OK');
  });

  it('devrait retourner le status 200', async () => {
    const response = await request(app).get('/test');
    expect(response.status).to.equal(200);
  });

  it('devrait traiter correctement les requêtes POST', async () => {
    app.post('/test', (req, res) => {
      res.json({ message: 'POST OK' });
    });
    const response = await request(app).post('/test');
    expect(response.status).to.equal(200);
  });
});
