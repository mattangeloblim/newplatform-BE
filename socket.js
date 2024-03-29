require("dotenv").config();
const socketIO = require('socket.io');
const { transactionHistory, walletBalance } = require("./services/userWalletService")

let io;
const userSockets = {};

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: true, // Allow connections from any origin
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {

        const player_id = socket.handshake.query.player_id;

        userSockets[player_id] = socket;

        const numberOfUsers = Object.keys(userSockets).length;
        console.log("Number of connected users:", numberOfUsers);

        socket.on('disconnect', () => {
            delete userSockets[player_id];

            const numberOfUsers = Object.keys(userSockets).length;
            console.log("Number of connected users:", numberOfUsers);

            io.emit('numberOfUsers', numberOfUsers);
        });

        socket.on('getTransactionHistory', async () => {
            try {
                const transactionList = await transactionHistory(player_id);
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
                console.error("Error fetching transaction history:", error);
            }
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized.');
    }
    return io;
}


module.exports = { initializeSocket, getIO };