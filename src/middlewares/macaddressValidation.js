const MacaddressValidation = (req,res, next) => {
    if (!req.body.macaddress){
        return res.status(400).json({ error: 'É necessário inserir um endereço macaddress!'});
    }else{
        next();
    };
};

module.exports = MacaddressValidation;