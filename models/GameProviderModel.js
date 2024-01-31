const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GameProvider = sequelize.define("GameProvider", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    game_provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    game_provider_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider_api_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    environment: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'Game_Provider',
    timestamps: true,
});

// GameProvider.sync()

module.exports = GameProvider;