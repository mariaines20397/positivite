module.exports = (sequelize, dataTypes) => {
    let alias = 'Roles';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        role: {
            type: dataTypes.STRING,
            allowNull: false
        }
    };
    let config = {
        tableName: 'roles',
        timestamps: false
    };
    const Rol = sequelize.define(alias, cols, config);
    Rol.associate = function(models) {
        Rol.hasMany(models.Users, {
            as: 'users',
            foreignKey: 'role_id'
        });
    }
    return Rol;
}