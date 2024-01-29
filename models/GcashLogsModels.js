const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GcashLogs = sequelize.define("GcashLogs", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    merchant_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expiry_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    function_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    request_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    acquirement_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    checkout_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Gcash_Logs',
    timestamps: true,
});

// GcashLogs.sync()

module.exports = GcashLogs;