// adminService.js

const AdminModel = require("../models/AdminModel")
const Roles = require("../models/RolesModel");
const bcrypt = require('bcrypt');
const User = require("../models/UserModel");
const sequelize = require("sequelize");
const Admin = require("../models/AdminModel");
const Roles_Permission = require("../models/RolesModel");
const Wallet = require("../models/WalletModel");

async function authenticateAdmin(username, password) {
    const admin = await AdminModel.findOne({ where: { username } });

    if (!admin) {
        throw new Error("Invalid Username");
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
        throw new Error("Invalid Password");
    }

    return { username: admin.username, role: admin.role };
}

async function editRolePermissions(roleName, newPermissions) {
    const role = await Roles.findOne({ where: { role_name: roleName } });

    if (!role) {
        throw new Error("Role not found");
    }

    if (!role.permissions || !Array.isArray(role.permissions)) {
        role.permissions = [];
    }

    role.permissions = role.permissions.concat(newPermissions);

    await role.save();

    return role;
}

async function fetchNumberOfRegisteredUsersPerDay() {
    try {
        const registeredUsersPerDay = await User.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'userCount'],
                [sequelize.fn('DATE', sequelize.col('updatedAt')), 'date'],
            ],
            group: [sequelize.fn('DATE', sequelize.col('updatedAt'))],
        });

        return registeredUsersPerDay;
    } catch (error) {
        console.error('Error fetching registered users per day:', error);
        throw error; // Handle the error as needed
    }
}

async function fetchAdminRegister() {
    try {
        const adminRegistered = await Admin.findAll();
        return adminRegistered;
    } catch (error) {
        console.error('Error fetching registered users per day:', error);
        throw error;
    }
}

async function fetchAdminRoles() {
    try {
        const roles = await Roles_Permission.findAll();
        return roles;
    } catch (error) {
        console.error('Error fetching permission', error);
        throw error;
    }
}

async function fetchUsers() {
    try {
        const Users = await User.findAll();
        return Users
    } catch (error) {
        console.error('Error Fetching User', error)
        throw error;
    }
}

async function fetchUserProfile(player_id) {
    try {
        const ProfileUser = await User.findOne({
            where: {
                player_id: player_id
            }
        })
        const ProfileWallet = await Wallet.findOne({
            where:{
                player_id:player_id
            }
        })

        const formattedReturn = {
            PlayerId: ProfileUser.player_id,
            Username: ProfileUser.username,
            Email:ProfileUser.email,
            Phone: ProfileUser.phone,
            Birthdate: ProfileUser.birthdate,
            Name: ProfileUser.name,
            isVerified: ProfileUser.isVerified,
            isActive: ProfileUser.isActive,
            DateReg: ProfileUser.createdAt,
            Wallet: ProfileWallet.wallet_balance,
            OverallDep: ProfileWallet.overall_deposit,
            OverallWithdraw: ProfileWallet.overall_withdraw,
            first_deposit: ProfileWallet.first_deposit_at
        }

        return formattedReturn

    } catch (error) {
        console.error('Error Fetching profile', error)
        throw error;
    }
}


module.exports = {
    authenticateAdmin,
    editRolePermissions,
    fetchNumberOfRegisteredUsersPerDay,
    fetchAdminRegister,
    fetchAdminRoles,
    fetchUsers,
    fetchUserProfile
};
