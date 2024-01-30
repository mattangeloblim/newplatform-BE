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
    socket.emit('getWalletBalance')
});

// Listen for the server's 'transactionHistory' response
socket.on('transactionHistory', (transactionList) => {
    console.log('Received transaction history:', transactionList);
});

// Listen for the server's 'walletBalanceUpdate' response
socket.on('walletBalanceUpdate', (data) => {
    console.log('Received wallet balance:', data);
});

// Listen for disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
