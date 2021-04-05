//importa função da dependência date-fns para verificar se uma data esta no passado
const { isPast } = require('date-fns')

//importa os dados do arquivo
const TaskModel = require('../model/taskModel')

//cria uma constante que recebe uma função middleware(requisição, resposta, proxima execução)
const TaskValidation = async(req,res,next) =>{

    //cria uma constante que vai receber os valores da requisição
    const { macaddress, type, title, description, when } = req.body
    
    /* Cria as condições de validação */

    //Se não existir valor para a chave json
    //retorne a resposta como o status 400 e inclua no erro a msg para o usuário
    if (!macaddress)
    return res.status(400).json({error:'Macaddress é obrigatório!'});
    else if(!type)
    return res.status(400).json({error:'O tipo é obrigatório!'});
    else if(!title)
    return res.status(400).json({error:'O título é obrigatório!'});
    else if(!description)
    return res.status(400).json({error:'A Descrição é obrigatória!'});
    else if(!when)
    return res.status(400).json({error:'A Data e hora são dados obrigatórios!'});

    //senão siga para o próximo passo
    else{  
        
   
        //crio uma variável para realizar algumas verificações se tem dados com datas repetidas no banco
        let  exists;

        //se for uma tarefa que esta sendo alterada(pq ja temos o id nesse caso)
        if (req.params.id){
        exists = await TaskModel.findOne({
            '_id' : {'$ne'  : req.params.id}, //se não existir nenhum id com que tem no parâmetro
            'when': {'$eq' : new Date(when)}, // e se encontrar uma chave when igual a o que esta sendo requisitado
            'macaddress' : {'$in' : macaddress} // e se encontrar uma chave macaddress ao que esta sendo requisitado
          });
        

          //se for uma tarefa que esta sendo criada. sem id ainda
        }else{

    //com ajuda da função da dependência date-fns, verifico se a data da chave when esta no passado, se for uma tarefa que esta sendo criada
         if( isPast(new Date(when))) 
         return res.status(400).json({error:'Escolha uma data e hora que seja maior que a data e hora atual!'});

        //a variável vai receber o retorno de uma consulta do banco de dados do mongodb com sua sintaxe db.FindOne
        //basicamente ele faz tipo im select que verifica se existe a data existe com o mesmo macaddress(pq pode ter datas diferentes p/ diferentes dispositivos)
        exists = await TaskModel.findOne({
                                          'when' :{'$eq' : new Date(when)}, //se encontrar uma chave when igual a o que esta sendo requisitado
                                          'macaddress' : {'$in' : macaddress} // e se encontrar uma chave macaddress ao que esta sendo requisitado
                                        });
        }
        //se retornar alguma coisa encontrada no banco, não permitir seguir                                
        if (exists){
            return res.status(400).json('Não é possível inserir uma tarefa no mesmo dia e horário!')
        }
        next();
    }
        

} 

//exporta para ficar liberado para todos os locais
module.exports = TaskValidation;