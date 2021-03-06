/*/
Esse arquivo retorna o banco de dados conectado
*/

require("dotenv").config();

const mongoose = require('mongoose');

//mongodb://localhost do banco/nome do bando desejado
const url = process.env.DATABASE_URL
//mongodb+srv://user-deploy:<password>@dbservice.d73kg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

//acessa uma função para definir a url e colocar que é compativel com outras versões
//mongoose.connect(url, { useNewUrlParser: true });

//mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}); //alterei para essa nova instrução a de cima estava depreciada

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).then(res=>{
          console.log("DB Connected!")
  }).catch(err => {
    console.log(Error, err.message);
  })

//exporta o uma variável para poder usar esse arquivo em outros locais
module.exports = mongoose;
