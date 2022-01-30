const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const mongoose = require('../../src/models/connection');

chai.use(chaiHttp);
const { expect } = chai;

const userTest = {
  name: 'Elizabeth Queen',
  cpf: '12345678911',
  balance: 15000,
};

const userTestList = [
  {
    cpf: '12345678912',
    balance: 15000,
  },
  {
    name: 'Isaac Newton',
    balance: 15000,
  },
  {
    name: 'Albert Einstein',
    cpf: '12345678914',
  },
  {
    name: 'Sócrates',
    cpf: '1234',
    balance: 15000,
  },
];

describe('Testes de criação de usuário', () => {
  describe('1 - Quando criar um novo usuário com sucesso', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      response = await chai.request(app).post('/user').send(userTest);
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
      expect(response.body.data).to.deep.equal(userTest);
    });
  });

  describe('2 - Quando tentar criar um novo usuário sem o campo "name"', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      response = await chai.request(app).post('/user').send(userTestList[0]);
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

  describe('3 - Quando tentar criar um novo usuário sem o campo "cpf"', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      response = await chai.request(app).post('/user').send(userTestList[1]);
    });

    it('3.1 - Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('3.2 - Deve conter a propriedade "message" ', () => {
      expect(response.body).to.have.property('message');
    });

    it('3.3 - A mensagem deve informar o usuário que o campo "cpf" é necessário', () => {
      expect(response.body.message).to.be.equal('"cpf" is required');
    });
  });

  describe('4 - Quando tentar criar um novo usuário sem o campo "balance"', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      response = await chai.request(app).post('/user').send(userTestList[2]);
    });

    it('4.1 - Deve retornar o status 201', () => {
      expect(response).to.have.status(201);
    });

    it('4.2 - Deve conter a propriedade "message" ', () => {
      expect(response.body).to.have.property('message');
    });

    it('4.3 - Deve criar um usuário com sucesso porém com o saldo padrão de 10000', () => {
      expect(response.body).to.be.an('object');
    });
  });

  describe('5 - Quando tentar criar um novo usuário com o campo "CPF" de forma incorreta', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      response = await chai.request(app).post('/user').send(userTestList[3]);
    });

    it('5.1 - Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('5.2 - Deve conter a propriedade "message" ', () => {
      expect(response.body).to.have.property('message');
    });

    it('5.3 - Deve conter uma mensagem indicando que o "CPF" está incorreto', () => {
      expect(response.body.message).to.be.equal('Digite um CPF válido');
    });
  });
});
