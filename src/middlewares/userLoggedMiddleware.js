//**Middleware controlo el acceso del usuario usando Sequelize**/

const fs = require('fs');
const path = require('path');

//------- Sequelize ----------------//

const {Users} = require('../../database/models');


module.exports = (req,res,next) =>{
    //Variable locals (super global - vive en las vistas )
    res.locals.usuario = false;
    
    if(req.session.usuario){
        //console.log('Daniel '+ req.session.usuario.email);
        res.locals.usuario = req.session.usuario;
        return next();
    }else if(req.cookies.email){
        console.log('Cookie '+ req.cookies.email);
        Users.findOne({
            where: {
               email: req.cookies.email
            }
        })
        .then(user =>{
            req.session.usuario = user;
            res.locals.usuario = user;
            
            return next();
    
        })
                
    }else{
        return next();
    }
}

