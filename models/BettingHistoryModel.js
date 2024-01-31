const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BettingHistory = sequelize.define("BettingHistory", {
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
    game_provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    game_provider_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    game_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    wallet_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bet_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
    },
    round_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    jackpot_contribution: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'Betting_History',
    timestamps: true,
});

// BettingHistory.sync()

module.exports = BettingHistory;