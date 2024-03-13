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
    useragent:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    browser_type:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    device_type:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// Ip_Address.sync()

module.exports = Ip_Address;