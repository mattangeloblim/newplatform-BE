const express = require("express")
const router = express.Router()
const Wallet = require("../../models/WalletModel")
const BettingHistory = require("../../models/BettingHistoryModel")
const cookieParser = require('cookie-parser');
const BettingResult = require("../../models/BettingResultModel");
const Affiliation = require("../../models/AffiliationModel");
const User = require("../../models/UserModel");

router.use(cookieParser());

router.get("/bingo-games/wallet", async (req, res) => {
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
        const { user_id, token, amount, transaction_id, round_id, jackpot_contribution, game_type } = req.body

        const bet_id = Date.now().toString();

        const gameTypeMapping = {
            "13 BALL BINGO WEB": "13 Ball Bingo",
            "BINGO PARES WEB": "Bingo Pares",
            "BINGO PERYAHAN WEB": "Bingo Peryahan",
            "BINGO SWERTRES WEB": "Bingo Swertres",
            "DRAGON VS TIGER BINGO WEB": "Dragon vs Tiger",
            "FORTUNE 30 WEB": "Fortune 30",
            "GOLD FARM WEB": "Gold Farm",
            "GOLDEN ERA WEB": "Golden Era",
            "PIRATE BABES WEB": "Pirate Babes",
            "SEA RICHES WEB": "Sea Riches"
        };

        const mappedGameType = gameTypeMapping[game_type];

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
            game_provider_id: 888,
            game_provider_name: "DG",
            game_name: mappedGameType,
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

        const checkUser = await User.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['referral_token']
        })

        const ref_token = checkUser.dataValues.referral_token

        if (ref_token !== null) {
            const affiliationRecord = await Affiliation.findOne({
                where: {
                    token: ref_token
                },
                attributes: ['affiliation_balance']
            });

            if (affiliationRecord) {
                const currentAffiliationBalance = affiliationRecord.dataValues.affiliation_balance;

                // Increment the affiliation balance
                const updatedAffiliationBalance = currentAffiliationBalance + amount * 0.01;

                await Affiliation.update(
                    { affiliation_balance: updatedAffiliationBalance },
                    {
                        where: {
                            token: ref_token
                        }
                    }
                )
            }
        }

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
        const { user_id, amount, transaction_id, round_id, win_type } = req.body;

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
            win_type
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
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router