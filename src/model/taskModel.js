
const mongoose = require('../config/database');

//Instanciamos o objeto para usar o Schema que é responsável por criar estrutura de representação do Banco
const Schema = mongoose.Schema;

//armazena a estrutura da representação do banco
const TaskShema = new Schema ({

    macaddress: {type: String,required: true},
    type: {type:Number, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},  
    when: {type:Date, required:true},//armazena data e hora
    done: {type:Boolean, default:false},
    created:{type:Date, default:Date.now()} 
});

//exporta para poder usar em outros locais com o nome "mongose.model"
// e com 2 parâmetros, o nome que vamos dar a representação e o objeto que contem a estrutura de representação
module.exports = mongoose.model('tasks', TaskShema)
