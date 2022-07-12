const path = require('path');
const {validationResult} = require('express-validator');
let db = require('../../database/models')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {

    //Listar todos los productos del carrito
    cart: (req,res) =>{
        db.Items.findAll({
            where: {
                userId: req.session.usuario.id,
                state: 1
            },
            include: {
                all: true,
                nested: true
            }
        })
        .then(items =>{
            let total = items.reduce((total,item)=> (total = total + Number(item.subtotal)),0)
            res.render(path.join(__dirname, "../views/carrito/carrito"), {cartProductos :items, toThousand, total})
        })
    },

    //Agregar productos al carrito
    addItemCart: (req,res) =>{
        const errores = validationResult(req);
        if(errores.isEmpty()){
            //Debemos buscar el producto por el id
            db.Products.findByPk(req.body.productId,{
                include: ['categories']
            })
            .then((productos) =>{
                //Agregamos el producto al carrito
                return db.Items.create({
                    price : productos.price,
                    quantity : 1,
                    subtotal : productos.price,
                    state: 1,
                    userId: req.session.usuario.id,
                    productId: productos.id,
                    cartId: 1
                }) 
                .then(item  => res.redirect('/carrito/carrito'))
                .catch(error => console.log(error)) 
            })
        }else{
            db.Products.findByPk(req.params.id,{
                include: ['category']
            })
            .then(producto =>{
                res.render(path.join(__dirname, "../views/products/productDetail"), {producto, toThousand})
            })
        }
    },

    //Incrementamos un producto del carrito
    incrementItemCart: (req,res) =>{
        db.Items.findByPk(req.params.id)
        .then(item =>{
            item.quantity = item.quantity + 1;
            item.subtotal = item.quantity * item.price;
            item.save()
            .then(item =>{
                res.redirect('/carrito/carrito')
            })
        })
    },

    //Decrementamos un producto del carrito
    decrementItemCart: (req,res) =>{
        db.Items.findByPk(req.params.id)
        .then(item =>{
            if(item.quantity > 1){
            item.quantity = item.quantity - 1;
            item.subtotal = item.quantity * item.price;
            item.save()
            .then(item =>{
                res.redirect('/carrito/carrito')
            })
        }})
    },

    //Eliminamos un producto del carrito
    eraseItemCart: (req,res) =>{
        db.Items.destroy({
            where: {id : req.params.id}
        }).then(item =>{
                res.redirect('/carrito/carrito')
            })
        },

    
    //Eliminamos todos los productos del carrito
    deleteCart: (req,res) =>{
        db.Items.destroy({
            where: {
                userId: req.session.usuario.id,
                state: 1
            }
        })
        .then(() => res.redirect('/'))
    }
};

