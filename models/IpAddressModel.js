const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Ip_Address = sequelize.define('Ip_Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});
// Ip_Address.sync()

module.exports = Ip_Address;