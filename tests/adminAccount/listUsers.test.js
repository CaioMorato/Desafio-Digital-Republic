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

describe('Teste das listagens de Usuário', () => {
  describe('1 - Quando a listagem ocorre de forma correta', () => {
    let response = {};

    before(async () => {
      mongoose.connection.db.dropCollection('adminaccounts');
      mongoose.connection.db.dropCollection('useraccounts');

      await chai.request(app).post('/admin').send(adminAccount);

      await chai.request(app).post('/user').send(userTestList[0]);
      await chai.request(app).post('/user').send(userTestList[1]);
      await chai.request(app).post('/user').send(userTestList[2]);

      let {
        body: { token },
      } = await chai
        .request(app)
        .put(`/admin`)
        .send({ email: adminAccount.email, password: adminAccount.password });

      response = await chai.request(app).get('/accounts').set('Authorization', token);
    });

    it('1.1 - Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('1.2 - Deve retornar o array com o nome dos usuários cadastrados corretamente', () => {
      const firstUsername = userTestList[0].name;
      const secondUsername = userTestList[1].name;
      const thirdUsername = userTestList[2].name;

      expect(response.body).to.have.property('users');
      expect(response.body.users[0].name).to.be.equal(firstUsername);
      expect(response.body.users[1].name).to.be.equal(secondUsername);
      expect(response.body.users[2].name).to.be.equal(thirdUsername);
    });

    it('1.3 - Deve retornar o array com o nome dos usuários cadastrados corretamente', () => {
      const firstCPF = userTestList[0].cpf;
      const secondCPF = userTestList[1].cpf;
      const thirdCPF = userTestList[2].cpf;

      expect(response.body).to.have.property('users');
      expect(response.body.users[0].cpf).to.be.equal(firstCPF);
      expect(response.body.users[1].cpf).to.be.equal(secondCPF);
      expect(response.body.users[2].cpf).to.be.equal(thirdCPF);
    });

    it('1.4 - Deve retornar o array com o nome dos usuários cadastrados corretamente', () => {
      const firstBalance = userTestList[0].balance;
      const secondBalance = userTestList[1].balance;
      const thirdBalance = userTestList[2].balance;

      expect(response.body).to.have.property('users');
      expect(response.body.users[0].balance).to.be.equal(firstBalance);
      expect(response.body.users[1].balance).to.be.equal(secondBalance);
      expect(response.body.users[2].balance).to.be.equal(thirdBalance);
    });
  });
});
