const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Roles_Permission = sequelize.define("Roles_Permission", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    permissions:{
        type: DataTypes.JSON,
        allowNull: false,
    }
}, {
    tableName: 'Roles_Permission',
    timestamps: true,
});

module.exports = Roles_Permission;