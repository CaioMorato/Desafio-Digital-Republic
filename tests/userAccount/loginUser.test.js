const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const mongoose = require('../../src/models/connection');
const { getPayload } = require('../../src/services/tokenServices');

chai.use(chaiHttp);
const { expect } = chai;

const userTest = {
  name: 'Elizabeth Queen',
  cpf: '12345678911',
  balance: 15000,
};

const fakeUser = {
  name: 'Anonymous User',
  cpf: '11987654321',
  balance: 15000,
};

describe('Testes de Login de Usuário', () => {
  describe('1 - Quando o login ocorre de forma correta', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(userTest);

      response = await chai.request(app).put(`/user/${userTest.cpf}`);
    });

    it('1.1 - Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('1.2 - Deve retornar um token como resposta', () => {
      expect(response.body).to.have.property('token');
    });

    it('1.3 - O payload do token deve conter o cpf do usuário', () => {
      const token = response.body.token;
      const payload = getPayload(token);

      expect(payload.cpf).to.be.equal(userTest.cpf);
    });
  });

  describe('2 - Quanto tentar logar com um usuário inexistente', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(userTest);

      response = await chai.request(app).put(`/user/${fakeUser.cpf}`);
    });

    it('2.1 - Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('2.2 - Deve retornar uma mensagem dizendo que o CPF está incorreto', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Verifique o CPF digitado e tente novamente');
    });
  });
});
