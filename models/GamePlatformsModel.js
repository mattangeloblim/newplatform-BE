const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GamePlatform = sequelize.define("GamePlatform", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'Game_Platform',
    timestamps: true,
});

// GamePlatform.sync()

module.exports = GamePlatform;
