require("dotenv").config();
//biblioteca que serve como sistema de rotas, requisições http, tratamento de exceções
const express = require('express');

//biblioteca que permite que nossa api seja consumida a partir de outros servidores
const cors = require('cors')

//instanciamos o express na constante server
const server = express();

//aplicamos o uso do cors na nossa aplicação
server.use(cors());

//entende arquivos json nas requisições e respostas
server.use(express.json())

//chama o arquivo de rotas
const TaskRoutes = require('./routes/taskRoutes');

//usa a rota task prefixada, e executa o que tem no arquivo de rotas
server.use('/task', TaskRoutes);

server.listen(process.env.PORT || 3333, ()=>{
    console.log('Api Online');
})

//exemplo de rota/
/*server.get('/teste', (req, resp) =>{
    resp.send('Bem vindo a minha api');
  })
*/