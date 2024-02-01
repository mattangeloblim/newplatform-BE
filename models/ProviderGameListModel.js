const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProviderGameList = sequelize.define("ProviderGameList", {
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
    game_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    game_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    game_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    tableName: 'Provider_Game_List',
    timestamps: false,
});

// ProviderGameList.sync()

module.exports = ProviderGameList;