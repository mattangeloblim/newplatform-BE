const socketIOClient  = require('socket.io-client');

// Replace 'http://your-server-url' with the actual URL of your Socket.IO server
const socket = socketIOClient ('http://localhost:8080', {
  query: {
    player_id: '08eab45f-763e-49df-b9ec-afc00b2afe00',
  },
});

socket.on('connect', () => {
    console.log('Connected to the server');

    // Simulate a 'getTransactionHistory' request
    socket.emit('getTransactionHistory');
    socket.emit('getWalletBalance');
    socket.emit('getUserBetHistory')
    socket.emit('getBettingLogs')
    socket.emit('getTransactionLogs')
    socket.emit('getActiveUsers')
});

// Listen for the server's 'transactionHistory' response
// socket.on('activeUsersNum', (transactionList) => {
//     console.log('Received users count:', transactionList);
// });

// // Listen for the server's 'walletBalanceUpdate' response
// socket.on('walletBalanceUpdate', (data) => {
//     console.log('Received wallet balance:', data);
// });

// // Listen for the server's 'userbettingHistory' response
// socket.on('betHistory', (bettings) => {
//   console.log('Received transaction history:', bettings);
// });

// // Listen for the server's 'userbettingHistory' response
// socket.on('bettingLogs', (bets) => {
//   console.log('Received transaction history:', bets);
// });

// Listen for the server's 'userbettingHistory' response
// socket.on('transactionLogs', (transaction) => {
//   console.log('Received transaction history:', transaction);
// });

// Listen for disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
