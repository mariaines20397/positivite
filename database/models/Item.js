module.exports = (sequelize, dataTypes) => {
    let alias = 'Items';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        price: {
            type: dataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        quantity: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        subtotal: {
            type: dataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        state: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        cartId: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    };
    let config = {
        tableName: 'items',
        timestamps: false
    };
    const Item = sequelize.define(alias, cols, config);
    Item.associate = function(models) {
        Item.belongsTo(models.Products, {
            as: 'product',
            foreignKey: 'productId'
        });
        Item.belongsTo(models.Carts, {
            as: 'cart',
            foreignKey: 'cartId'
        });
        Item.belongsTo(models.Users, {
            as: 'user',
            foreignKey: 'userId'
        });
    };
    return Item;
}