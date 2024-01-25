const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Wallet = sequelize.define("Wallet", {
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
    wallet_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wallet_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    overall_withdraw: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    overall_deposit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    first_deposit_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'Wallets',
    timestamps: true,
});

// Wallet.sync()

module.exports = Wallet;