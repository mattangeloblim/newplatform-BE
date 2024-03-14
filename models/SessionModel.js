const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Sessions = sequelize.define("Sessions", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    player_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    }
}, {
    tableName: 'Sessions',
    timestamps: true,
});

// Sessions.sync()

module.exports = Sessions;