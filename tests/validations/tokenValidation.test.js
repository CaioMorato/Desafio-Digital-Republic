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

const depositTest = {
  amount: 1500,
};

describe('Testes de Validação de Token', () => {
  describe('1 - Quando o token não é colocado', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(userTest);

      let {
        body: { token },
      } = await chai.request(app).put(`/user/${userTest.cpf}`);

      response = await chai.request(app).post('/deposit').send(depositTest);
    });

    it('1.1 - Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('1.2 - Deve retornar uma mensagem dizendo que o token não foi encontrado', () => {
      expect(response.body.message).to.be.equal('Token não encontrado');
    });
  });

  describe('2 - Quando o token colocado é inválido', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(userTest);

      let {
        body: { token },
      } = await chai.request(app).put(`/user/${userTest.cpf}`);

      const fakeToken = token.slice(0, -1);

      response = await chai
        .request(app)
        .post('/deposit')
        .send(depositTest)
        .set('Authorization', fakeToken);
    });

    it('2.1 - Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('2.2 - Deve retornar uma mensagem dizendo que o token é inválido', () => {
      expect(response.body.message).to.be.equal('Token inválido');
    });
  });
});
