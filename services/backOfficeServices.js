const BettingHistory = require("../models/BettingHistoryModel")
const BettingResult = require("../models/BettingResultModel");
const GcashLogs = require("../models/GcashLogsModels");
const Transaction = require("../models/TransactionModel");

async function fetchBettingLogs() {
    const userBettingHistory = await BettingHistory.findAll();
    const userBettingResult = await BettingResult.findAll();

    // map to store the total amount_won
    const totalAmountsWon = {};
    userBettingResult.forEach(result => {
        totalAmountsWon[result.round_id] = (totalAmountsWon[result.round_id] || 0) + result.amount_won;
    });

    const enhancedBettingHistory = userBettingHistory.map(history => {
        const totalAmountWon = totalAmountsWon[history.round_id] || 0;
        const winType = totalAmountWon > 0 ? "WIN" : "LOSE";

        return {
            ...history.dataValues,
            amount_won: totalAmountWon,
            win_type: winType
        };
    });

    return enhancedBettingHistory;
}

async function fetchTransactionLogs() {
    const transactionLogs = await Transaction.findAll()

    return transactionLogs
}


async function PaymentLogs() {
    const payments = await GcashLogs.findAll()
    
    return payments
}

module.exports = {
    fetchBettingLogs,
    fetchTransactionLogs,
    PaymentLogs
};