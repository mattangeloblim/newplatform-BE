// adminService.js
const AdminModel = require("../models/AdminModel")
const Roles = require("../models/RolesModel");
const bcrypt = require('bcrypt');
const User = require("../models/UserModel");
const sequelize = require("sequelize");
const Admin = require("../models/AdminModel");
const Roles_Permission = require("../models/RolesModel");
const Wallet = require("../models/WalletModel");
const Transaction = require("../models/TransactionModel");
const { Op, fn, col } = require("sequelize");
const BettingHistory = require("../models/BettingHistoryModel");
const BettingResult = require("../models/BettingResultModel")


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
            where: {
                player_id: player_id
            }
        })

        const formattedReturn = {
            PlayerId: ProfileUser.player_id,
            Username: ProfileUser.username,
            Email: ProfileUser.email,
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

async function fetchUserDeposit(player_id, startdate, enddate) {
    try {

        const totalDeposit = await Transaction.findAll({
            where: {
                player_id: player_id,
                transaction_type: "Deposit",
                status: "SUCCESS",
                createdAt: {
                    [Op.between]: [startdate, enddate]
                }
            }
        })

        return totalDeposit

    } catch (error) {
        console.error('Error Fetching deposit', error)
        throw error;
    }
}

async function fetchUserWithdrawal(player_id, startdate, enddate) {
    try {

        const totalWithdrawal = await Transaction.findAll({
            where: {
                player_id: player_id,
                transaction_type: "Withdrawal",
                status: "SUCCESS",
                createdAt: {
                    [Op.between]: [startdate, enddate]
                }
            }
        })
        return totalWithdrawal

    } catch (error) {
        console.error('Error Fetching deposit', error)
        throw error;
    }
}

async function fetchBetNumber(player_id, startdate, enddate) {
    try {
        // Count the number of bets per day
        const betCounts = await BettingHistory.findAll({
            attributes: [
                [sequelize.literal('DATE(createdAt)'), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'bet_count']
            ],
            where: {
                player_id: player_id,
                createdAt: {
                    [Op.between]: [startdate, enddate]
                }
            },
            group: [sequelize.literal('DATE(createdAt)')],
        });

        return betCounts;
    } catch (error) {
        console.error('Error fetching bet counts:', error);
        throw error;
    }
}

async function fetchwinloss(player_id, startdate, enddate) {
    try {
        const noOfBettings = await BettingHistory.count({
            where: {
                player_id: player_id,
                createdAt: {
                    [Op.between]: [startdate, enddate]
                }
            }
        })

        const wins = await BettingResult.count({
            where: {
                player_id: player_id,
                createdAt: {
                    [Op.between]: [startdate, enddate]
                }
            }
        })

        const responseFormat = {
            bets: noOfBettings,
            winnings: wins
        }

        return responseFormat

    } catch (error) {
        console.error("error fetching winloss", error)
        throw error;
    }
}

async function totalTurnOver(startdate, enddate) {

    const endDatePlusOneDay = new Date(enddate);
    endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);

    const turnover = await BettingHistory.findAll({
        attributes: [[fn('SUM', col('amount')), 'totalAmount']],
        where: {
            createdAt: {
                [Op.between]: [startdate, endDatePlusOneDay]
            }
        }
    })

    const win = await BettingResult.findAll({
        attributes: [[fn('SUM', col('amount_won')), 'totalAmountWon']],
        where: {
            createdAt: {
                [Op.between]: [startdate, endDatePlusOneDay]
            }
        }
    })
    const totalTurnover = turnover[0].dataValues.totalAmount;
    const totalWin = win[0].dataValues.totalAmountWon;

    // Calculating winloss
    const winloss = totalTurnover - totalWin;


    return { totalTurnover, winloss };
}

async function firstDeposit(startdate, enddate) {
    const endDatePlusOneDay = new Date(enddate);
    endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);

    const firstDepositPlayer = await Wallet.findAll({
        where: {
            first_deposit_at: {
                [Op.ne]: null,
                [Op.between]: [startdate, endDatePlusOneDay]
            }
        }
    })

    return firstDepositPlayer
}

module.exports = {
    authenticateAdmin,
    editRolePermissions,
    fetchNumberOfRegisteredUsersPerDay,
    fetchAdminRegister,
    fetchAdminRoles,
    fetchUsers,
    fetchUserProfile,
    fetchUserDeposit,
    fetchUserWithdrawal,
    fetchBetNumber,
    fetchwinloss,
    totalTurnOver,
    firstDeposit
};
