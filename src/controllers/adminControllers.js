const fs = require('fs');
const path = require('path');
const {validationResult} = require("express-validator")
const bcryptjs = require('bcryptjs');
let db = require('../../database/models');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {

  //Administración de productos
  products: (req, res) => {
    db.Products.findAll(
      {include: ['categories']})
      .then((productos)=>{
        db.Categories.findAll()
        .then((categorias)=>{
          res.render(path.join(__dirname, "../views/admin/products/adminProducts"), {productos, categorias, toThousand})
        })
      })
	},

  //Administración de usuarios
  //Listado de usuarios
  users: (req, res) => {
    db.Users.findAll(
      {include: ['role']})
    .then((usuarios)=>{
      db.Roles.findAll()
      .then((roles)=>{
        res.render(path.join(__dirname, "../views/admin/users/adminUsers"), {usuarios, roles})
    })
  })
  },

  //Crear usuario
  usersCreate: (req, res) => {
    db.Roles.findAll()
    .then((roles)=>{
      res.render(path.join(__dirname, "../views/admin/users/adminUsersCreate"), {roles})
    })
  },

  //Guardar usuario creado
  usersSave: (req, res) => {
    let errors = validationResult(req);
    if(errors.isEmpty()){
      db.Users.create({
        name: req.body.name,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 10),
        avatar: req.file.filename,
        role_id: req.body.rol
      })
      .then(()=>{
        res.redirect('/admin/adminusuarios')
      })
    }else{
      db.Roles.findAll()
      .then((roles)=>{
        res.render(path.join(__dirname, "../views/admin/users/adminUsersCreate"), {errors: errors.mapped(), oldData: req.body, roles})
      })
    }
  },

  //Editar usuario
  usersEdit: (req, res) => {
    db.Users.findByPk(req.params.id, {
      include: ['role']
    })
    .then((usuarioActualizar)=>{
      db.Roles.findAll()
      .then((roles)=>{
        res.render(path.join(__dirname, "../views/admin/users/adminUsersEdit"), {usuarioActualizar, roles})
      })
    })
  },

  //Guardar usuario editado
  usersUpdate: (req, res) => {
       db.Users.update({
        name: req.body.name,
        email: req.body.email,
        role_id: req.body.rol
      }, {
        where: {
          id: req.params.id
        }
      })
      .then(()=>{
        res.redirect('/admin/adminusuarios')
      })
  },

  //Eliminar usuario
  usersDelete: (req, res) => {
    db.Users.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(()=>{
      res.redirect('/admin/adminusuarios')
    })
  }
  
}