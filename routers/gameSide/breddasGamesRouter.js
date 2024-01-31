const express = require("express")
const router = express.Router()
const Wallet = require("../../models/WalletModel")
const md5 = require('md5');

router.get("/bingo-games/wallet/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const { token } = req.query;

        const userWallet = await Wallet.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['wallet_balance']
        });

        const response = {
            status: 1,
            result: {
                currency: "PHP",
                balance: userWallet ? userWallet.wallet_balance : 0,
                userId: user_id,
                status: "Success"
            }
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 0, error: 'Internal Server Error' });
    }
});

router.post("/bingo-games/bet", async (req, res) => {
    try {
        const { user_id, token, amount, transaction_id, round_id, jackpot_contribution } = req.query

        const userWallet = await Wallet.findOne({
            where:{
                player_id:user_id
            },
            attributes:['wallet_balance']
        })

        console.log(userWallet)

        // const bettingHistory = await BettingHistory.create({
        //     player_id: user_id,
        //     token: token,
        //     amount: amount,
        //     transaction_id: transaction_id,
        //     round_id: round_id,
        //     jackpot_contribution: jackpot_contribution
        // })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})


module.exports = router