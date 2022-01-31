# API DRBank!

### Projeto de uma API em Node.js integrada ao MongoDB

---

## Visão Geral

##### Este projeto foi realizado, utilizando-se quatro bibliotecas, listadas abaixo, e aceita requisições  **GET**, **POST** e **PUT**

##### Bibliotecas:

* [Express](https://expressjs.com/) v4.17.2 - Framework Node	
* [Mongoose](https://mongoosejs.com/) v6.1.8 - Integração com MongoDB
* [Nodemon](https://www.npmjs.com/package/nodemon) v2.0.15 - Reinicia automaticamente o servidor quando detecta alterações
* [CryptoJS](https://cryptojs.gitbook.io/docs/) v4.1.1 - Criptografia das senhas salvas
* [JOI](https://joi.dev/) v17.5.5 - Validações dos campos
* [JSON Web Token](https://jwt.io/) v8.5.1 - Geração de token de autenticação

---

## **Sumário**

- [Pré Requisitos](#pré-requisitos)
- [Ambiente de Desenvolvimento .env](#ambiente)
- [Instalação](#instalação)
- [Contexto e Regras de Negócio](#contexto-e-regras-de-negócio)
- [Rotas | Endpoints](#rotas-|-endpoints)
  - [Usuários](#usuários)
    - [Criar usuário](#criar-usuário)
    - [Login](#login-de-usuários)
    - [Depósito](#depositar-dinheiro-em-sua-conta)
    - [Transferência](#transferência-entre-contas)
  - [Administradores](#administradores)
    - [Criar conta](#criar-admin)
    - [Login](#login-de-administrador)
    - [Listagem de contas](#listagem-de-contas)
    - [Listagem de transferências](#listagem-de-transferências)
- [Testes](#testes)
- [Sobre o autor](#sobre-o-autor)

---

## **Pré requisitos**

##### Este projeto foi feito em um ambiente linux, sendo recomendado o uso do mesmo para utilização do projeto. O guia apresentado abaixo se dará para esse sistema.

Também é necessário que o usuário tenha o banco de dados **mongodb** instalado e ativo em seu computador.

Para ativar o servidor, basta digitar em seu terminal: 

##### `sudo service mongod start`

Para verificar se o sistema está ativo, digite: 

##### `service mongod status`

---

## **Instalação**

Para começar a utilizar esse projeto, é bem simples: basta instalar as dependências do projeto, digitando o seguinte comando em seu terminal:

##### `npm install`

Após instalar as dependências, também é necessário iniciar o servidor. Para ativar o servidor, digite em seu terminal:

##### `npm start`

Com isso, ele mostrará que o servidor está iniciado e em qual porta.

---

## **Ambiente de Desenvolvimento .env**

Há um arquivo na raiz do projeto chamado .env.example. Para que a aplicação funcione você deve usá-lo como base.

Renomeie o arquivo para somente ".env" e utilize as 2 variáveis definidas tendo em mente:

***`PORT`*** será a variável que define a porta onde você prefere que o servidor seja iniciado. Caso não coloque, o padrão será 3000.

***`SECRET`*** será a variável que armazena o ***segredo*** do jsonwebtoken.

---

## Contexto e Regras de Negócio

### O contexto dessa API é simular possíveis ações de um banco com as seguintes regras de negócio que guiaram o desenvolvimento do projeto:

- #### Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa;

- #### Com essa conta é possível realizar transferências para outras contas e depositar;

- #### Não aceitamos valores negativos nas contas;

- #### Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000;

- #### As transferências entre contas são gratuitas e ilimitadas;

### Então essa API foi dividida em 2 camadas principais e suas seguintes ações:

- Usuários:
  - Criar conta
  
  - Logar
  
  - Fazer depósitos
  
  - Fazer transferências
  
- Administradores:
- Criar conta
  
- Logar
  
- Visualizar contas de usuário
  
- Visualizar transferências feitas

### Cada uma com um endpoint e método que serão explicados mais abaixo.

---

## Rotas | Endpoints

## Usuários

#### **Criar Usuário:**

- #### **POST** - `/user`

  Através desse endpoint, é possível inserir/cadastrar usuários no banco de dados. 

  É necessário enviar uma requisição com o formato JSON no corpo, com o seguinte formato:

  ```json
  {
  	"name": "Nome do Usuário",
  	"cpf": "12345678911",
  	"balance": 15000
  }
  ```

  A resposta se dará em formato de objeto com duas chaves. A primeira mostrando uma mensagem e a segunda mostrando o checkout de informações

  Exemplo:

  ```json
  {
    "message": 'Conta criada com Sucesso! Boas vindas ao DRBank!',
    "data": {
      "name": "Nome do Usuário",
  	"cpf": "12345678911",
      "balance": "15000"
    }
  }
  ```
  
  ### **Validações:**
  
- O campo **"name"** deve ter o formato String
  - O campo **"cpf"** deve ter o formato String com 11 dígitos e deve ser único
- O campo **"balance"** é **opcional**. Se for colocado, o saldo da conta será o valor inserido. Caso não seja colocado o padrão é o saldo de **10000** pra todas as contas novas 

### **Login de Usuário:**

- #### **PUT** - `/user/{cpf}` 

  Através desse endpoint, é possível fazer o login de usuário necessário para realizar operações. É necessário colocar o cpf do usuário na URL da requisição.

  

  A resposta será um token gerado que deve ser colocado no HEADER das operações, com a chave **Authorization**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIxMjM0NTY3ODkxMyIsImlhdCI6MTY0MzQ3MjM3OSwiZXhwIjoxNjQzNDczNTc5fQ.afMOQshRdEjeT8IDfyJF_ZXVUEHyLTlbzsT8CbR0HJs"
  }
  ```


### **Depositar dinheiro em sua conta:**

- #### **POST** - `/deposit`

  Através desse endpoint, é possível fazer um depósito ao saldo de sua conta.

  

  **Atenção**: É preciso estar logado. E para isso é necessário pegar o token gerado ao efetuar o login e colocar no header da requisição a chave **Authorization** com o valor do **token** gerado

  

  Também é necessário enviar uma requisição com o formato JSON no corpo, com o seguinte formato:

  ```json
  {
  	"amount": 1500
  }
  ```

  ### **Validações:**

  - o campo **"amount"** deve ter o formato Number e seguindo uma das regras de negócio, o **valor** não pode passar de 2000.

  

  A resposta se dará com o seguinte formato:

  ```json
  {
  	"message": "Seu depósito foi efetuado e seu saldo foi atualizado! Obrigado por usar nossos serviços.",
  	"balance": 16000
  }
  ```




#### **Transferência entre contas:**

- #### **POST** - `/transfer`

  Através desse endpoint, é possível fazer um depósito ao saldo de sua conta.

  

  **Atenção**: É preciso estar logado. E para isso é necessário pegar o token gerado ao efetuar o login e colocar no header da requisição a chave **Authorization** com o valor do **token** gerado

  

  Também é necessário enviar uma requisição com o formato JSON no corpo, com o seguinte formato:

  ```json
  {
      "receiver": "12345678912"
  	"amount": 1500
  }
  ```

  ### **Validações:**

  - O campo **"receiver"** deve ter o formato String, deve conter 11 dígitos e ser um CPF válido de uma outra conta cadastrada.
  - O campo **"amount"** deve ter o formato Number

  

  A resposta se dará com o seguinte formato:

  ```json
  {
  	"message": "Sua transferência foi realizada e seu saldo foi atualizado! Obrigado por usar nossos serviços.",
  	"balance": 11500
  }
  ```

---

## Administradores

### **Criar Admin:**

- #### **POST** - `/admin

  Através desse endpoint, é possível inserir/cadastrar administradores no banco de dados. 

  É necessário enviar uma requisição com o formato JSON no corpo, com o seguinte formato:

  ```json
  {
  	"name": "Nuwanda1",
  	"email": "nuwanda1@email.com",
  	"password": "1234"
  }
  ```

  A resposta se dará em formato de objeto com duas chaves. A primeira mostrando uma mensagem e a segunda mostrando o checkout de informações

  Exemplo:

  ```json
  {
  	"message": "Conta criada com Sucesso! Boas vindas ao DRBank!",
  	"data": {
  		"name": "Nuwanda1",
  		"email": "nuwanda1@email.com"
  	}
  }
  ```

  ### **Validações:**

  - O campo **"name"** deve ter o formato String
  - O campo **"email"** deve ter o formato String e ser um e-mail válido e único.
  - O campo **"password"** deve ter o formato String



### **Login de Administrador:**

- #### **PUT** - `/admin` 

  Através desse endpoint, é possível fazer o login de administrador necessário para realizar operações. 

  

  É necessário enviar uma requisição com o formato JSON no corpo, com o seguinte formato:

  ```json
  {
  	"email": "nuwanda1@email.com",
  	"password": "1234"
  }
  ```

  

  A resposta será um token gerado que deve ser colocado no HEADER das operações, com a chave **Authorization**

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIxMjM0NTY3ODkxMyIsImlhdCI6MTY0MzQ3MjM3OSwiZXhwIjoxNjQzNDczNTc5fQ.afMOQshRdEjeT8IDfyJF_ZXVUEHyLTlbzsT8CbR0HJs"
  }
  ```



### **Listagem de Contas:**

- #### **GET** - `/accounts` 

  Através desse endpoint, é possível obter a lista de todas as contas de usuário criadas.

  

  **Atenção**: É preciso estar logado. E para isso é necessário pegar o token gerado ao efetuar o login e colocar no header da requisição a chave **Authorization** com o valor do **token** gerado

  

  A resposta será uma lista com todos os usuários e seus respectivos saldos

  ```json
  {
  	"users": [
  		{
  			"_id": "61f34ecc773c1adc6ebcd095",
  			"name": "Nuwanda1",
  			"cpf": "12345678911",
  			"balance": 15000
  		},
  		{
  			"_id": "61f35158e7fa5f1b6926be5e",
  			"name": "Nuwanda2",
  			"cpf": "12345678912",
  			"balance": 16500
  		},
  		{
  			"_id": "61f565edb6b9f2a08723cabf",
  			"name": "Nuwanda3",
  			"cpf": "12345678913",
  			"balance": 11500
  		}
  	]
  }
  ```



### **Listagem de Transferências:**

- #### **GET** - `/transfers` 

  Através desse endpoint, é possível obter a lista de todas as transferências já realizadas.

  

  **Atenção**: É preciso estar logado. E para isso é necessário pegar o token gerado ao efetuar o login e colocar no header da requisição a chave **Authorization** com o valor do **token** gerado

  

  A resposta será uma lista com todas as transferências realizadas, quem enviou, quem recebeu, o valor e a data da operação

  ```json
  {
  	"data": [
  		{
  			"_id": "61f56188ef70573015fb95ca",
  			"sender": "12345678911",
  			"receiver": "12345678912",
  			"amount": 1500,
  			"createdAt": "2022-01-29T15:47:20.038Z"
  		},
  		{
  			"_id": "61f5663fb6b9f2a08723cac7",
  			"sender": "12345678913",
  			"receiver": "12345678911",
  			"amount": 1500,
  			"createdAt": "2022-01-29T16:07:27.337Z"
  		},
  		{
  			"_id": "61f56646b6b9f2a08723cacd",
  			"sender": "12345678913",
  			"receiver": "12345678911",
  			"amount": 1500,
  			"createdAt": "2022-01-29T16:07:34.692Z"
  		},
  		{
  			"_id": "61f5669ab6b9f2a08723cad9",
  			"sender": "12345678913",
  			"receiver": "12345678911",
  			"amount": 1500,
  			"createdAt": "2022-01-29T16:08:58.244Z"
  		}
  	]
  }
  ```

  

---

## Testes

#### Esse projeto conta com uma cobertura de testes de integração.

Foram utilizadas as bibliotecas **mocha** e **chai** para efetuar os testes de integração, e também a biblioteca **nyc/istanbul** para verificar a cobertura de testes

#### Os testes podem ser realizados digitando o seguinte comando em seu terminal:

**`npm test`**

##### E a cobertura dos testes pode ser verificada digitando o seguinte comando:

**`npm run coverage`**

##### Gerando a seguinte resposta: 

![coverage-test-image](./tests/images/test-coverage.png)

---

## **Sobre o autor**

Olá! Que bom que chegou até aqui!

Eu me chamo Caio, e sou estudante de desenvolvimento Web. Comecei meus estudos no ano de 2021, e estou me apaixonando cada dia que passa, através dos estudos, por tecnologia e desenvolvimento. Esse projeto e esse README foram desenvolvidos como um desafio técnico. Eu empenhei muito carinho na construção de cada linha.

[Você pode olhar mais dos meus repositórios aqui](https://github.com/CaioMorato)

[Ou se conectar comigo no linkedin!](https://www.linkedin.com/in/morato-dev/)