const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const mongoose = require('../../src/models/connection');

chai.use(chaiHttp);
const { expect } = chai;

const adminTest = {
  name: 'Elizabeth Queen',
  email: 'lizzy@queen.com',
  password: '1234',
};

const adminTestList = [
  {
    email: 'firstadmin@email.com',
    password: '1234',
  },
  {
    name: 'Second Admin',
    password: '1234',
  },
  {
    name: 'Third Admin',
    email: 'thirdadmin@email.com',
  },
];

describe('Testes de criação de admin', () => {
  describe('1 - Quando criar um novo admin com sucesso', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');

      response = await chai.request(app).post('/admin').send(adminTest);
    });

    it('1.1 - Deve retornar o status 201', async () => {
      expect(response).to.have.status(201);
    });

    it('1.2 - Deve retornar um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('1.3 - Deve conter as propriedades "message" e "data" ', () => {
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('data');
    });

    it('1.4 - A propriedade "message" deve conter a seguinte mensagem: "Conta criada com Sucesso! Boas vindas ao DRBank!"', () => {
      expect(response.body.message).to.be.equal('Conta criada com Sucesso! Boas vindas ao DRBank!');
    });

    it('1.5 - A propriedade "data" deve conter os mesmos dados que foram cadastrados no banco', () => {
      expect(response.body.data).to.deep.equal({ name: adminTest.name, email: adminTest.email });
    });
  });

  describe('2 - Quando tentar criar um novo usuário sem o campo "name"', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');

      response = await chai.request(app).post('/admin').send(adminTestList[0]);
    });

    it('2.1 - Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('2.2 - Deve conter a propriedade "message" ', () => {
      expect(response.body).to.have.property('message');
    });

    it('2.3 - A mensagem deve informar o usuário que o campo "name" é necessário', () => {
      expect(response.body.message).to.be.equal('"name" is required');
    });
  });

  describe('3 - Quando tentar criar um novo usuário sem o campo "email"', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');

      response = await chai.request(app).post('/admin').send(adminTestList[1]);
    });

    it('3.1 - Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('3.2 - Deve conter a propriedade "message" ', () => {
      expect(response.body).to.have.property('message');
    });

    it('3.3 - A mensagem deve informar o usuário que o campo "email" é necessário', () => {
      expect(response.body.message).to.be.equal('"email" is required');
    });
  });

  describe('4 - Quando tentar criar um novo usuário sem o campo "password"', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');

      response = await chai.request(app).post('/admin').send(adminTestList[2]);
    });

    it('4.1 - Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('4.2 - Deve conter a propriedade "message" ', () => {
      expect(response.body).to.have.property('message');
    });

    it('4.3 - A mensagem deve informar o usuário que o campo "name" é necessário', () => {
      expect(response.body.message).to.be.equal('"password" is required');
    });
  });
});
