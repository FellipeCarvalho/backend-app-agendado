/*/
Esse arquivo retorna o banco de dados conectado
*/
const mongoose = require('mongoose');

//mongodb://localhost do banco/nome do bando desejado
const url = 'mongodb://localhost:27017/agendado'
//acessa uma função para definir a url e colocar que é compativel com outras versões
//mongoose.connect(url, { useNewUrlParser: true });

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}); //alterei para essa nova instrução a de cima estava depreciada

//exporta o uma variável para poder usar esse arquivo em outros locais
module.exports = mongoose;
