const db = require('../../../database/models');
const sequelize = db.sequelize;

const productsAPIControllers = {
    'list': (req, res) => {
        db.Products.findAll({
            include: ['categories']
        })
        .then(products => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: products.length,
                    url: 'api/products'
                },
                data: products
            }
                res.json(respuesta);
            })
    },

    'detail': (req, res) => {
        db.Products.findByPk(req.params.id, {
            include: ['categories']
        })
        .then(product => {
            let respuesta = {
                meta: {
                    status : 200,
                    total: product.length,
                    url: 'api/products'
                },
                data: product
            }
                res.json(respuesta);
            })
    }
}

module.exports = productsAPIControllers;