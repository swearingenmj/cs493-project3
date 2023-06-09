const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const bcrypt = require('bcryptjs');
const passwordHash = await bcrypt.hash(user.password, 8);
const usersCollection = mongoDB.collection('users')

const User = sequelize.define('user', {
    userId: { type: DataTypes.INTEGER, primaryKey, autoIncrement: true },
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
