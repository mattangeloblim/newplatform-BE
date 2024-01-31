const express = require("express")
const router = express.Router()
const Wallet = require("../../models/WalletModel")
const GameProvider = require("../../models/GameProviderModel")
const ProviderGameList = require("../../models/ProviderGameListModel")
const GamePlatform = require("../../models/GamePlatformsModel")


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
        const { user_id, token, amount, transaction_id, round_id, jackpot_contribution } = req.body

        const findUserWallet = await Wallet.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['wallet_balance']
        })
        const currentWallet = findUserWallet.dataValues.wallet_balance
        const updatedBalance = currentWallet - amount

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