const BettingHistory = require("../models/BettingHistoryModel")
const BettingResult = require("../models/BettingResultModel");
const Transaction = require("../models/TransactionModel");


async function fetchBettingLogs() {
    const userBettingHistory = await BettingHistory.findAll();
    const userBettingResult = await BettingResult.findAll();

    const enhancedBettingHistory = userBettingHistory.map(history => {
        const matchingResult = userBettingResult.find(result => result.round_id === history.round_id);

        if (matchingResult) {
            return {
                ...history.dataValues,
                amount_won: matchingResult.amount_won,
                win_type: matchingResult.win_type
            };
        } else {
            return {
                ...history.dataValues,
                amount_won: 0,
                win_type: "LOSE"
            };
        }
    });

    return enhancedBettingHistory;
}

async function fetchTransactionLogs() {
    const transactionLogs = await Transaction.findAll()

    return transactionLogs
}


module.exports = {
    fetchBettingLogs,
    fetchTransactionLogs
};