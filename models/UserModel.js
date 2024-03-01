const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
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
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        // primaryKey:true,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
        // validate: {
        //     isPhilippinePhoneNumber(value) {
        //         const philippinePhoneNumberRegex = /^(\+?63|0)?[9]\d{9}$/;

        //         if (!philippinePhoneNumberRegex.test(value)) {
        //             throw new Error('Invalid Philippine phone number format');
        //         }
        //     },
        // }
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Player"
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    referral_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
}, {
    tableName: 'Users',
    timestamps: true,
});

// User.sync()

module.exports = User;