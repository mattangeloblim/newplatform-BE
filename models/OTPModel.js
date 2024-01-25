const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OTP = sequelize.define("OTP", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    player_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    OTP: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'OTPS',
    timestamps: true,
});

OTP.sync()

module.exports = OTP;