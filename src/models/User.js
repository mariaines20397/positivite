fs = require('fs');
path = require('path');

const User = {

    filename: path.join(__dirname, '../data/usersDataBase.json'),

    getData: function () {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    },

    findAll: function () {
        return this.getData();
    },

    generateId: function () {
        const allUsers = this.findAll();
        const lastUser = allUsers.pop();
        if (lastUser) {
            return lastUser.id + 1;
        } else {
            return 1;
        }
    },

    findByPk: function (id) {
        const allUsers = this.findAll();
        const userFound = allUsers.find(user => user.id === id);
        return userFound;
    },

    findByField: function (field, text) {
        const allUsers = this.findAll();
        const userFound = allUsers.find(user => user[field] === text);
        return userFound;
    },

    create: function(userData){
        const allUsers = this.findAll();
        const newUser = {
            id: this.generateId(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            avatar: userData.avatar
        };
        allUsers.push(newUser);
        fs.writeFileSync(this.filename, JSON.stringify(allUsers, null, ' '));
        return newUser;
    },

    delete: function(id){
        const allUsers = this.findAll();
        const finalUsers = allUsers.filter(user => user.id !== id);
        fs.writeFileSync(this.filename, JSON.stringify(finalUsers, null, ' '));
        return true;
    },
}

module.exports = User;