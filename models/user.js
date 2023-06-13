const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const bcrypt = require('bcryptjs');

const User = sequelize.define('user', {
    userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, set(password) {
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        this.setDataValue('password', hash)
        } 
    },
    admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
})

exports.User = User

exports.UserClientFields = [
    'userId',
    'name',
    'email',
    'password',
    'admin'
]
