const express = require("express")
const router = express.Router()
const Wallet = require("../../models/WalletModel")
// const GameProvider = require("../../models/GameProviderModel")
// const ProviderGameList = require("../../models/ProviderGameListModel")
// const GamePlatform = require("../../models/GamePlatformsModel")
const BettingHistory = require("../../models/BettingHistoryModel")
const cookieParser = require('cookie-parser');
const BettingResult = require("../../models/BettingResultModel");

router.use(cookieParser());

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
        // const { game_provider_id, game_provider_name, game_name } = req.query
        const { user_id, token, amount, transaction_id, round_id, jackpot_contribution } = req.body

        const bet_id = Date.now().toString();
        const game_name = req.cookies.game_name;
        const game_type = req.cookies.game_type;
        const provider_name = req.cookies.provider_name;

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
            game_provider_id: game_type,
            game_provider_name: provider_name,
            game_name: game_name,
            amount: amount,
            wallet_id: userWalletId,
            bet_id: bet_id,
            transaction_id: transaction_id,
            round_id: round_id,
            jackpot_contribution: amount * 0.005
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

router.post("/bingo-games/win", async (req, res) => {
    try {
        const { user_id, amount, transaction_id, round_id, result } = req.body;

        const findUserWallet = await Wallet.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['wallet_balance']
        })

        const currentWallet = findUserWallet.dataValues.wallet_balance
        const updatedBalance = parseFloat(currentWallet) + parseFloat(amount);

        await BettingResult.create({
            player_id: user_id,
            amount_won: amount,
            transaction_id,
            round_id,
            win_type: result
        })

        await Wallet.update (
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
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router