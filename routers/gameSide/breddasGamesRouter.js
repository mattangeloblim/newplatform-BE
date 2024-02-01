const express = require("express")
const router = express.Router()
const Wallet = require("../../models/WalletModel")
// const GameProvider = require("../../models/GameProviderModel")
// const ProviderGameList = require("../../models/ProviderGameListModel")
// const GamePlatform = require("../../models/GamePlatformsModel")
const BettingHistory = require("../../models/BettingHistoryModel")


router.post("/bingo-games/wallet", async (req, res) => {
    try {
        const { user_id, token } = req.body

        const userWallet = await Wallet.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['wallet_balance']
        });

        const response = {
            currency: "PHP",
            balance: userWallet ? userWallet.wallet_balance : 0,
            userId: user_id,
            status: "Success"
        };
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: 'Internal Server Error' });
    }
});


router.post("/bingo-games/bet", async (req, res) => {
    try {
        const { game_provider_id, game_provider_name, game_name } = req.query
        const { user_id, token, amount, transaction_id, round_id, jackpot_contribution } = req.body

        const bet_id = Date.now().toString();

        const findUserWallet = await Wallet.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['wallet_balance', 'wallet_id']
        })
        const currentWallet = findUserWallet.dataValues.wallet_balance
        const userWalletId = findUserWallet.dataValues.wallet_id

        const updatedBalance = currentWallet - amount

        await BettingHistory.create({
            player_id: user_id,
            game_provider_id: game_provider_id,
            game_provider_name: game_provider_name,
            game_name: game_name,
            amount: amount,
            wallet_id: userWalletId,
            bet_id: bet_id,
            transaction_id: transaction_id,
            round_id: round_id,
            jackpot_contribution: jackpot_contribution
        })

        await Wallet.update(
            { wallet_balance: updatedBalance },
            {
                where: {
                    player_id: user_id
                }
            }
        );

        const response = {
            currency: "PHP",
            balance: updatedBalance,
            userId: user_id,
            status: "Success"
        };

        res.json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})


module.exports = router