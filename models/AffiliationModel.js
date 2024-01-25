const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Affiliation = sequelize.define("Affiliation", {
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
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    affiliation_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    affiliation_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    affiliate_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'Affiliations',
    timestamps: true,
});

// Affiliation.sync()

module.exports = Affiliation;