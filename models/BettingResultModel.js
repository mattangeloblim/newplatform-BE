const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BettingResult = sequelize.define("BettingResult", {
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
    amount_won: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    round_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    win_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'Betting_Result',
    timestamps: true,
});

// BettingResult.sync()

module.exports = BettingResult;