
const express = require("express");

//chama a função de rotas do express
const router = express.Router();

//coloca o arquivo de controller aqui
const TaskController = require("../controller/taskController");

//coloca o arquivo das validações aqui
const TaskValidation = require("../middlewares/taskValidation");
//const MacaddressValidation = require("../middlewares/macaddressValidation"); //não foi necessario mais usalo, ja que estava jogando no parametro

/*1. Adicionei o TaskValidation que executa as validações para criação de dados no banco, dessa rota*/
//adicionar rota e o controle que vai receptar essa rota, além da função que será usada
router.post('/',TaskValidation, TaskController.create);

//Rota para update
router.put('/:id',TaskValidation, TaskController.update);

//Rota para consultar todos os documentos de um macaddres
router.get('/filter/all/:macaddress', TaskController.all);

//Rota para consultar um único registro (não coloquei nenhuma validação)
router.get('/:id', TaskController.show);

//Rota para deletar um único registro no banco de dados (não coloquei nenhuma validação)
router.delete('/:id', TaskController.delete);

//Rota para encontrar um  registro no banco de dados e atualizar 1 informação 
router.put('/:id/:done', TaskController.done);

//Rota para trazer as tarefas atrasadas
router.get('/filter/late/:macaddress', TaskController.late);


//Rota para trazer as tarefas do dia
router.get('/filter/today/:macaddress', TaskController.today);

//Rota para trazer as tarefas da semana
router.get('/filter/week/:macaddress', TaskController.week);

//Rota para trazer as tarefas do Mês
router.get('/filter/month/:macaddress', TaskController.month);

//Rota para trazer as tarefas do Mês
router.get('/filter/year/:macaddress', TaskController.year);



//libera em todos os locais 
module.exports = router;
