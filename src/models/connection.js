const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/DRBank', options, callback)
  .then(() => {
    console.log('Conexão com o banco de dados efetuada com sucesso');
  })
  .catch((err) => console.log(err));

module.exports = mongoose;
