const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const mongoose = require('../../src/models/connection');

const accountServices = require('../../src/services/accountsServices');

chai.use(chaiHttp);
const { expect } = chai;

const testUsers = [
  {
    name: 'Elizabeth Queen',
    cpf: '12345678911',
    balance: 15000,
  },
  {
    name: 'Albert Einstein',
    cpf: '12345678912',
    balance: 15000,
  },
];

const transferData = {
  receiver: testUsers[1].cpf,
  amount: 5000,
};

describe('Testes de Transferências entre Contas', () => {
  describe('1 - Quando a transferência é efetuada com sucesso', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('transferdatas');
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/user').send(testUsers[0]);

      await chai.request(app).post('/user').send(testUsers[1]);

      let {
        body: { token },
      } = await chai.request(app).put(`/user/${testUsers[0].cpf}`);

      response = await chai
        .request(app)
        .post('/transfer')
        .set('Authorization', token)
        .send(transferData);
    });

    after(() => {
      mongoose.connection.db.dropCollection('transferdatas');
    });

    it('1.1 - Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('2.1 - Deve atualizar o saldo do remetente', async () => {
      const [sender] = await accountServices.findUser(testUsers[0].cpf);

      expect(sender.balance).to.be.equal(testUsers[0].balance - transferData.amount);
    });

    it('3.1 - Deve atualziar o saldo do destinatário', async () => {
      const [receiver] = await accountServices.findUser(testUsers[1].cpf);

      expect(receiver.balance).to.be.equal(testUsers[1].balance + transferData.amount);
    });
  });
});
