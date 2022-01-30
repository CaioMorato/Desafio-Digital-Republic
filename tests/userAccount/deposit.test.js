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

const addBalanceRange = [2000, 2500];

describe('Testes de Depósito de Saldo', () => {
  describe('1 - Quando o depósito ocorre da forma correta', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(userTest);

      let {
        body: { token },
      } = await chai.request(app).put(`/user/${userTest.cpf}`);

      response = await chai.request(app).post('/deposit').set({ Authorization: token }).send({
        amount: addBalanceRange[0],
      });
    });

    it('1.1 - Deve retornar o status 201', () => {
      expect(response).to.have.status(201);
    });

    it('1.2 - Deve retornar uma mensagem indicando que o depósito foi efetuado com sucesso', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(
        'Seu depósito foi efetuado e seu saldo foi atualizado! Obrigado por usar nossos serviços.'
      );
    });

    it('1.3 - Deve atualizar o saldo do usuário com o valor correto', () => {
      expect(response.body.balance).to.be.equal(userTest.balance + addBalanceRange[0]);
    });
  });

  describe('2 - Quando o depósito ocorre com um saldo maior que o limite de 2000 ou sem ser do tipo número', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(userTest);

      let {
        body: { token },
      } = await chai.request(app).put(`/user/${userTest.cpf}`);

      response = await chai.request(app).post('/deposit').set({ Authorization: token }).send({
        amount: addBalanceRange[1],
      });
    });

    it('2.1 - Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('2.2 - Deve retornar uma mensagem indicando que o depósito não pode ser efetuado', () => {
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal(
        'O valor de depósito deve ser um valor numérico maior que 0 e menor ou igual a 2000'
      );
    });
  });
});
