require("dotenv").config();
const socketIO = require('socket.io');
const { transactionHistory, walletBalance } = require("./services/userWalletService")
const { fetchBettingHistory } = require("./services/userHistoryService")
const { fetchBettingLogs, fetchTransactionLogs } = require("./services/backOfficeServices")
const { fetchNumberOfRegisteredUsersPerDay, fetchAdminRegister, fetchAdminRoles, fetchUsers, fetchUserProfile} = require("./services/adminServices")

let io;
const userSockets = {};

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: true, 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {

        const player_id = socket.handshake.query.player_id;

        userSockets[player_id] = socket;
        const numberOfUsers = Object.keys(userSockets).length;

        socket.on('disconnect', () => {
            delete userSockets[player_id];

            const numberOfUsers = Object.keys(userSockets).length;

            io.emit('numberOfUsers', numberOfUsers);
        });

        socket.on('getTransactionHistory', async (profile_id) => {
            try {
                const transactionList = await transactionHistory(profile_id);
                socket.emit('transactionHistory', transactionList);
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        });

        socket.on('getWalletBalance', async () => {
            try {
                
                const userWalletBalance = await walletBalance(player_id);
                socket.emit('walletBalanceUpdate', userWalletBalance);
            } catch (error) {
                console.error("Error fetching wallet", error);
            }
        });
        socket.on('getUserBetHistory', async (profile_id) => {
            try {
                const userBetHistory = await fetchBettingHistory(profile_id);
                socket.emit('betHistory', userBetHistory);
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        });
        socket.on('getBettingLogs', async () => {
            try {
                const bettingLogs = await fetchBettingLogs();
                socket.emit('bettingLogs', bettingLogs);
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        });
        socket.on('getTransactionLogs', async () => {
            try {
                const transactionLogs = await fetchTransactionLogs();
                socket.emit('transactionLogs', transactionLogs);
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        });
        socket.on('getActiveUsers', async () => {
            try {
                const activeUsers = await fetchNumberOfRegisteredUsersPerDay();
                socket.emit('activeUsersNum', activeUsers);
            } catch (error) {
                console.error("Error fetching activeUsersNum:", error);
            }
        });
        socket.on('getAllAdmin', async () => {
            try {
                const activeAdmins = await fetchAdminRegister();
                socket.emit('activeAdmin', activeAdmins);
            } catch (error) {
                console.error("Error fetching activeUsersNum:", error);
            }
        });
        socket.on('getAdminRoles', async () => {
            try {
                const adminRoles = await fetchAdminRoles();
                socket.emit('adminRoles', adminRoles);
            } catch (error) {
                console.error("Error fetching activeUsersNum:", error);
            }
        });

        socket.on('getAllUsers', async () =>{
            try {
                const fetchUser = await fetchUsers()
                socket.emit('FetchUser', fetchUser)
            } catch (error) {
                console.error('Error Fetching All User', error)
            }
        })

        socket.on('getProfileUser', async (profile_id) =>{
            try {
                console.log(profile_id)
                const userProfile = await fetchUserProfile(profile_id);
                socket.emit('profileUser', userProfile);
            } catch (error) {
                console.error('Error Fetching User Profile', error)
            }
        })
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized.');
    }
    return io;
}


module.exports = { initializeSocket, getIO };