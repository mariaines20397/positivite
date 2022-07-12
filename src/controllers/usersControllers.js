const path = require("path");
const fs = require('fs');
const {validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../../database/models');

module.exports = {

  //Pantalla de login
  login: (req, res) => {
    res.render(path.join(__dirname, "../views/users/login"))
  },
  
  //Procesar login
  loginProcess: (req, res) => {
    db.Users.findAll()
    .then((users) => {		
      let errors = validationResult(req);
      let usuarioLogueado = [];
      if(req.body.email != '' && req.body.password != ''){
        usuarioLogueado = users.filter(function (user) {
          if (user.email == req.body.email) {
            return user;
          }
        });

        if (usuarioLogueado[0] == undefined) {
          return res.render(path.join(__dirname, "../views/users/login"), { errors: 'credenciales inválidas' });
        }else{
          //Aquí verifico si la clave que está colocando es la misma que está hasheada en la Base de datos - El compareSync retorna un true ó un false
          if(bcryptjs.compareSync(req.body.password,usuarioLogueado[0].password) === false){
            usuarioLogueado = [];
          }
        }
      }
      //Aquí determino si el usuario fue encontrado ó no en la Base de Datos
      if (usuarioLogueado.length === 0) {
        return res.render(path.resolve(__dirname, '../views/users/login'),{ errors: errors.mapped(), oldData: req.body });
      } else {
        //Aquí guardo en SESSION al usuario logueado
        req.session.usuario = usuarioLogueado[0];
      }
      //Aquí verifico si el usuario le dio click en el check box para recordar al usuario 
      if(req.body.recordarPassword){
        res.cookie('email',usuarioLogueado[0].email,{maxAge: 1000 * 60 * 60 * 24})
      }
      return res.redirect('/');
    })
  },

  //Pantalla de registro
  register: (req, res) => {
    res.render(path.join(__dirname, "../views/users/register"))
  },

  //procesar registro
  registerProcess: (req, res) => {
    db.Users.findAll(
      { where: { email: req.body.email } }
    ).then((users) => {
       if(users.length > 0){
        return res.render(path.join(__dirname, "../views/users/register"), { errorEmailExist: 'El email ya existe en la base de datos', oldData: req.body });
        }else{  
          let errors = validationResult(req);
            if (errors.errors.length > 0) {
              res.render(path.join(__dirname, "../views/users/register"), {errors: errors.mapped(), oldData: req.body})
            }else{
              db.Users.create({
                name: req.body.name,
                email: req.body.email,
                password: bcryptjs.hashSync(req.body.password, 10),
                avatar: req.file.filename,
                role_id: 3,
              })
                .then((user)=>{
                  res.redirect('/users/login')
                }
              )
            }
        }
      }
      )
  },

  //Pantalla de perfil
  profile: (req, res) => {
    res.render(path.join(__dirname, "../views/users/profile"))
  },

  //Logout de usuario
  logout: (req, res) => {
    res.clearCookie('email');
    req.session.destroy();
    res.redirect("/");
  }
}