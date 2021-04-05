
const TaskModel = require('../model/taskModel');

//importa a função que pega o inicio e fim do dia da dependência para trabalhar com datas 
const {start, endOfDay, startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear,endOfYear} = require('date-fns');

//constante armazena a data atual
const current = new Date();


//criamos no formato de classe, já que o controller pode manipular varias outras situações
//e dentro da classe podemos disparar varias funções

//classe responsável por receber a requisição e enviar para o model, retornando a resposta
class TaskController {


    /*** POST- Função de criação de documento no banco de dados***/

    //async = faz com que a função seja assíncrona, evita executar múltiplas requisições ao mesmo tempo
    //usado com await em conjunto para esperar para ir para proxima requisição só após ter salvo no banco
    //dessa forma evita falhas no salvamento do banco de dados e comece a fazer outra requisição
    async create(req, res) {
        //a variável recebe a instancia do objeto com o body
        const task = new TaskModel(req.body);
        //await= espera o task salvar antes de ir para qlq outra requisição
        await task
            //função nativa que salva os registro no banco
            .save()
            //resposta se tudo deu certo, ele retorna um json
            .then(response => {
                return res.status(200).json(response);
            })
            //resposta se deu erro, ele retorna um json
            .catch(error => {
                return res.status(500).json(error);
            })
    }

    /*** PUT - Função de update de documento no banco de dados***/

    async update(req, res) {
        //espera o mongo verificar se encontrar um id em algum dos seus documentos e atualiza
        //TaskModel.findByIdAndUpdate é o formato de consulta e update usado no mongodb
        //ele verifica se tem algum id igual no parâmetro da solicitação, não no body
        //usado o body ali, para atualizar as informações de acordo com o que for requisitado no body
        //usado o new =true para responder com o novo body, e não com a tarefa antes de ser atualizada
        await TaskModel.findByIdAndUpdate({ '_id': req.params.id }, req.body, { new: true })
            //resposta se tudo deu certo, ele retorna um json
            .then(response => {
                return res.status(200).json(response);
            })
            //resposta se deu erro, ele retorna um json
            .catch(error => {
                return res.status(500).json(error);
            })
    }

    /*** GET - Função de consulta de documento no banco de dados com filtro por macaddress ***/

    async all(req, res) {
        //await = espera o mongo retornar a consulta no banco de dados
        //TaskModel.findB é o formato de consulta no mongodb, é tipo um select no sql
        //ele verifica se tem algum valor de macaddress igual no body da requisição
        //sort= para ordenar por data o retorno da resposta
        await TaskModel.find({ macaddress: { '$in': req.params.macaddress } })
            .sort('when')
            //resposta se tudo deu certo, ele retorna um json com todos os documentos do mesmo macaddress
            .then(response => {
                return res.status(200).json(response);
            })
            //resposta se deu erro, ele retorna um json
            .catch(error => {
                return res.status(500).json(error);
            })
    }

    /*** GET - Função de consulta de 1 documento específico no banco de dados com filtro por id ***/
    async show(req, res) {

        //função nativa para consultar no banco de dados se existe um id específico, usando query params para capturar esse id
        await TaskModel.findById(req.params.id)

            //resposta se tudo deu certo, ele retorna um json com a tarefa do id
            .then(response => {

                //vamos verificar nesse caso se a resposta tem algo
                if (response) {
                    return res.status(200).json(response);
                } else {
                    return res.status(404).json({ error: 'Tarefa com id: ' + req.params.id + ' não encontrada!' });
                }
            })

            //resposta se deu erro, ele retorna um json
            .catch(error => {
                return res.status(500).json(error);
            })
    }


    /*** DELETE - Função para deletar 1 registro no banco de dados com filtro por id  ***/
    async delete(req, res) {

        //deleteOne = função nativa para deletar 1 registro no banco de dados 
        await TaskModel.deleteOne({ '_id': req.params.id })

            //resposta se tudo deu certo, ele retorna um json
            .then(response => {
                return res.status(200).json(response);
            })
            //resposta se deu erro, ele retorna um json
            .catch(error => {
                return res.status(500).json(error);
            })
    }


    /*** GET AND UPDATE - Função para encontrar 1 registro e atualizar uma informação no registro no banco de dados com filtro por id  ***/
    async done(req, res) {

        //findByIdAndUpdate = função nativa
        await TaskModel.findByIdAndUpdate(
            { '_id': req.params.id },    //chave registro
            { 'done': req.params.done }, //parâmetro a ser atualizado
            { new: true }) //para resposta vir com registro atualizado

            //resposta se tudo deu certo, ele retorna um json
            .then(response => {
                return res.status(200).json(response);
            })
            //resposta se deu erro, ele retorna um json
            .catch(error => {
                return res.status(500).json(error);
            })
    }

        /*** GET TAREFAS ATRASADAS - Função para retornar apenas as tarefas atrasadas  ***/
        async late(req, res) {

            //find = função nativa é tipo um select
            await TaskModel
            
                .find({
                    'when' : {'$lt' : current}, //current é uma função nativa que retorna a data e hora atual. $lt = menor que
                    'macaddress' : {'$in' : req.params.macaddress}, //para resposta vir somente com dados do mesmo aparelho
                    'done' : {'$in' : 'false'}, //se a tarefa estiver concluida não é atrasado mais
                }) 
                .sort('when') //para vir as tarefas organizadas por data e hora
                
                //resposta se tudo deu certo, ele retorna um json
                .then(response => {
                    return res.status(200).json(response);
                }) 
                //resposta se deu erro, ele retorna um json
                .catch(error => {
                    return res.status(500).json(error); 
                }) 
        }

        /*** GET TAREFAS DO DIA - Função para retornar apenas as tarefas do dia  ***/
        async today(req, res) {

            //find = função nativa é tipo um select
            await TaskModel
            
                .find({
                    'macaddress' : {'$in' : req.params.macaddress}, //para resposta vir somente com dados do mesmo aparelho
                    //com ajuda da dependência date-nfs chamamos a função que pega o inicio do dia corrente e o final do dia corrente
                    'when' : {'$gte' : startOfDay(current), '$lt' : endOfDay(current)} //current é a data e hora atual da constante criada. $gte = maior que $lt = menor 
                }) 
                .sort('when') //para vir as tarefas organizadas por data e hora
                
                //resposta se tudo deu certo, ele retorna um json
                .then(response => {
                    return res.status(200).json(response);
                }) 
                //resposta se deu erro, ele retorna um json
                .catch(error => {
                    return res.status(500).json(error); 
                }) 
        }

        
        /*** GET TAREFAS DA SEMANA - Função para retornar apenas as tarefas do SEMANA  ***/
        async week(req, res) {

            //find = função nativa é tipo um select
            await TaskModel
            
                .find({
                    'macaddress' : {'$in' : req.params.macaddress}, //para resposta vir somente com dados do mesmo aparelho
                    //com ajuda da dependência date-nfs chamamos a função que pega o inicio da semana corrente e o final da semana   corrente
                    'when' : {'$gte' : startOfWeek(current), '$lt' : endOfWeek(current)} //current é a data e hora atual da constante criada. $gte = maior que $lt = menor 
                }) 
                .sort('when') //para vir as tarefas organizadas por data e hora
                
                //resposta se tudo deu certo, ele retorna um json
                .then(response => {
                    return res.status(200).json(response);
                }) 
                //resposta se deu erro, ele retorna um json
                .catch(error => {
                    return res.status(500).json(error); 
                }) 
        }

        /*** GET TAREFAS DO MES - Função para retornar apenas as tarefas do MES  ***/
        async month(req, res) {

            await TaskModel
            
                .find({
                    'macaddress' : {'$in' : req.params.macaddress},
                    'when' : {'$gte' : startOfMonth(current), '$lt' : endOfMonth(current)} 
                }) 
                .sort('when') 

                .then(response => {
                    return res.status(200).json(response);
                }) 
                .catch(error => {
                    return res.status(500).json(error); 
                }) 
        }

         /*** GET TAREFAS DO ANO - Função para retornar apenas as tarefas do ANO  ***/
        async year(req, res) {

            await TaskModel
            
                .find({
                    'macaddress' : {'$in' : req.params.macaddress},
                    'when' : {'$gte' : startOfYear(current), '$lt' : endOfYear(current)} 
                }) 
                .sort('when') 
                
                .then(response => {
                    return res.status(200).json(response);
                }) 
                .catch(error => {
                    return res.status(500).json(error); 
                }) 
        }

}



//exportamos para acessar de qualquer local o objeto criado a partir da classe TaskController
module.exports = new TaskController();

