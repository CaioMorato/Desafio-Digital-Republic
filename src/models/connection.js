const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DRBank').catch((err) => console.log(err));

module.exports = mongoose;
