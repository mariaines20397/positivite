module.exports = (sequelize, dataTypes) => {
    let alias = 'Carts';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        orderNumber: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: dataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        userId: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    };
    let config = {
        tableName: 'carts',
        timestamps: false
    };
    const Cart = sequelize.define(alias, cols, config);
    Cart.associate = function(models) {
        Cart.belongsTo(models.Users, {
            as: 'user',
            foreignKey: 'userId'
        });
        Cart.hasMany(models.Items, {
            as: 'items',
            foreignKey: 'cartId'
        });
    };
    return Cart;
}