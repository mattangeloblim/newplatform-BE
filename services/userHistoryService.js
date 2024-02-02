const BettingHistory = require("../models/BettingHistoryModel")
const BettingResult = require("../models/BettingResultModel")

async function fetchBettingHistory(player_id) {
    const userBettingHistory = await BettingHistory.findAll({
        where: {
            player_id: player_id
        }
    });
    const userBettingResult = await BettingResult.findAll({
        where: {
            player_id: player_id
        }
    });

    console.log(userBettingResult)

    const enhancedBettingHistory = userBettingHistory.map(history => {
        const matchingResult = userBettingResult.find(result => result.round_id === history.round_id);
        console.log(matchingResult)

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

module.exports = {
    fetchBettingHistory
};