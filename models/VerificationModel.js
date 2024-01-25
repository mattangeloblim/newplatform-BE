const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Verification = sequelize.define("Verification", {
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
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    mobile_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'Verifications',
    timestamps: true,
});

Verification.sync()

module.exports = Verification;