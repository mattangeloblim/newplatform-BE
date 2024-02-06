const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Ip_Address = sequelize.define('Ip_Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// Ip_Address.sync()

module.exports = Ip_Address;