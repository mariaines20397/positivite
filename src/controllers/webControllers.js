const fs = require('fs');
const path = require('path');
const db = require('../../database/models');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
  //index home
  index: (req, res) => {
    db.Products.findAll(
      {include: ['categories']})
      .then((producto)=>{
        db.Categories.findAll()
        .then((categorias)=>{
          res.render(path.join(__dirname, "../views/web/index"), {producto, categorias, toThousand})
        })
      })
	},

  //Pantalla de contacto
  contacUs: (req, res) => {
    res.render(path.join(__dirname, "../views/web/contacUs"));
  }, //contactanos
};
