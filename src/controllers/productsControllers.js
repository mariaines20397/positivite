const fs = require('fs');
const path = require('path');
const {validationResult} = require("express-validator")
const db = require('../../database/models')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
  //Home de productos
  products: (req, res) => {
    db.Products.findAll(
      {include: ['categories']})
      .then((producto)=>{
        db.Categories.findAll()
        .then((categorias)=>{
          res.render(path.join(__dirname, "../views/products/products"), {producto, categorias, toThousand})
        })
      })
	},

  //Detalle de producto
  productDetail: (req, res) => {
    db.Products.findByPk(req.params.id, {include: ['categories']})
    .then((producto)=>{
      //res.send(producto);
      db.Categories.findAll()
      .then((categorias)=>{
        res.render(path.join(__dirname, "../views/products/productDetail"), {producto, categorias, toThousand})
      })
    })
  },
  
  //Agregar producto
  productCreate: (req, res) => {
    db.Categories.findAll()
      .then((categorias)=>{
        res.render(path.join(__dirname, "../views/products/productCreate"), {categorias})
      })
  },

  //Guardar producto
  productSave: (req, res) => {
    let errors = validationResult(req);
    if (errors.errors.length > 0) {
      db.Categories.findAll()
        .then((categorias)=>{
          res.render(path.join(__dirname, "../views/products/productCreate"), {categorias, errors: errors.mapped(), oldData: req.body})
        })
    }else{
      db.Products.create({
        name: req.body.name,
        price: req.body.price,
        category_id: req.body.category,
        description: req.body.description,
        image: req.file.filename,
        stock: req.body.stock
      })
        .then((producto)=>{
          res.redirect('/admin/adminproductos')
        })
      }
  },

  //Editar producto
  productEdit: (req, res) => {
    db.Products.findByPk(req.params.id, {include: ['categories']})
      .then((producto)=>{
        db.Categories.findAll()
          .then((categorias)=>{
            res.render(path.join(__dirname, "../views/products/productEdit"), {producto, categorias})
          })
      })
  },

  //Guardar producto editado
  productUpdate: (req, res) => {
    db.Products.update({
      name: req.body.name,
      price: req.body.price,
      category_id: req.body.category,
      description: req.body.description,
      image: req.file,
      stock: req.body.stock
    },{
      where: {
        id: req.params.id
      }
    })
      .then((producto)=>{
        res.redirect('/admin/adminproductos')
      })
  },

  //Eliminar producto
  productDelete: (req, res) => {
    db.Products.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((producto)=>{
        res.redirect('/admin/adminproductos')
      })
  },

  //Buscar producto
  productSearch: (req, res) => {
    let search = req.body.search;
    if(search != ""){
      db.Products.findAll({
        where: {
          name: {
            [db.Sequelize.Op.like]: '%' + search + '%'
          }
        }
      })
        .then((producto)=>{
          console.log(producto);
          res.render(path.join(__dirname, "../views/products/productsSearch"), {producto, toThousand})
        })
    }else{
      res.redirect("/");
    }
  },
        
  //Carrito de compras
  shoppingCart: (req, res) => {
    res.render(path.join(__dirname, "../views/products/shoppingCart"))
  }
  
}