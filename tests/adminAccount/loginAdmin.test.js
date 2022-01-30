const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const mongoose = require('../../src/models/connection');
const { getPayload } = require('../../src/services/tokenServices');

chai.use(chaiHttp);
const { expect } = chai;

const adminTest = {
  name: 'Elizabeth Queen',
  email: 'lizzy@queen.com',
  password: '1234',
};

const fakeAdmin = {
  name: 'Anonymous Admin',
  email: 'fakeadmin@fake.com',
  password: '1234',
};

describe('Testes de Login de Admin', () => {
  describe('1 - Quando o login ocorre de forma correta', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');

      await chai.request(app).post('/admin').send(adminTest);

      response = await chai
        .request(app)
        .put(`/admin`)
        .send({ email: adminTest.email, password: adminTest.password });
    });

    it('1.1 - Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('1.2 - Deve retornar um token como resposta', () => {
      expect(response.body).to.have.property('token');
    });

    it('1.3 - O payload do token deve conter o email do admin', () => {
      const token = response.body.token;
      const payload = getPayload(token);

      expect(payload.email).to.be.equal(adminTest.email);
    });
  });

  describe('2 - Quanto tentar logar com um admin inexistente', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');

      await chai.request(app).post('/admin').send(adminTest);

      response = await chai
        .request(app)
        .put('/admin')
        .send({ email: fakeAdmin.email, password: fakeAdmin.password });
    });

    it('2.1 - Deve retornar o status 404', () => {
      expect(response).to.have.status(404);
    });

    it('2.2 - Deve retornar uma mensagem dizendo que o e-mail está incorreto', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('Verifique o e-mail digitado e tente novamente');
    });
  });
});
