const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const mongoose = require('../../src/models/connection');

chai.use(chaiHttp);
const { expect } = chai;

const adminAccount = {
  name: 'All Mighty',
  email: 'arumaito@email.com',
  password: '1234',
};

const userTestList = [
  {
    name: 'Elizabeth Queen',
    cpf: '12345678911',
    balance: 20000,
  },
  {
    name: 'Isaac Newton',
    cpf: '12345678912',
    balance: 15000,
  },
  {
    name: 'Albert Einstein',
    cpf: '12345678913',
    balance: 10000,
  },
];

const transferData = [
  { receiver: userTestList[1].cpf, amount: 5000 },
  { receiver: userTestList[2].cpf, amount: 6000 },
  { receiver: userTestList[1].cpf, amount: 7000 },
];

describe('Teste das listagens de Transferências entre Usuários', () => {
  describe('1 - Quando a listagem ocorre de forma correta', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');
      mongoose.connection.db.dropCollection('useraccounts');
      mongoose.connection.db.dropCollection('transferdatas');

      await chai.request(app).post('/admin').send(adminAccount);

      await chai.request(app).post('/user').send(userTestList[0]);
      await chai.request(app).post('/user').send(userTestList[1]);
      await chai.request(app).post('/user').send(userTestList[2]);

      // first User login
      let {
        body: { token: firstUserToken },
      } = await chai.request(app).put(`/user/${userTestList[0].cpf}`);

      // first user transfer to second user
      await chai
        .request(app)
        .post('/transfer')
        .set('Authorization', firstUserToken)
        .send(transferData[0]);

      // first user transfer to third user
      await chai
        .request(app)
        .post('/transfer')
        .set('Authorization', firstUserToken)
        .send(transferData[1]);

      // third User login
      let {
        body: { token: secondUserToken },
      } = await chai.request(app).put(`/user/${userTestList[2].cpf}`);

      // third user transfer to second user
      await chai
        .request(app)
        .post('/transfer')
        .set('Authorization', secondUserToken)
        .send(transferData[2]);

      let {
        body: { token: adminToken },
      } = await chai
        .request(app)
        .put(`/admin`)
        .send({ email: adminAccount.email, password: adminAccount.password });

      response = await chai.request(app).get('/transfers').set('Authorization', adminToken);
    });

    it('1.1 - Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('1.2 - Deve retornar o número correto de transferências feitas', () => {
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.length(3);
    });

    it('1.3 - Deve retornar os valores transferidos corretos', () => {
      const firstAmount = transferData[0].amount;
      const secondAmount = transferData[1].amount;
      const thirdAmount = transferData[2].amount;

      expect(response.body.data[0].amount).to.be.equal(firstAmount);
      expect(response.body.data[1].amount).to.be.equal(secondAmount);
      expect(response.body.data[2].amount).to.be.equal(thirdAmount);
    });
  });
});
