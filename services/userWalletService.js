const TransactionModel = require("../models/TransactionModel");
const GcashLogsModel = require("../models/GcashLogsModels")
const Wallet = require("../models/WalletModel");
const { generateTransactionId, generateTransferId } = require("../utils/TokenGenerated")
const axios = require("axios");
const Affiliation = require("../models/AffiliationModel");

async function depositUserWallet(keyData, player_id, amount) {
    const { wallet_id, gateway_payment } = keyData
    const transaction_id = generateTransactionId();

    const gcashApiUrl = "https://stagingapi.ops-gate.com/gcash/gcash-pay/create-order";

    if (gateway_payment === "GCASH") {
        // NEED TO BE CHANGE
        const gcashData = {
            user_id: transaction_id,
            amount,
            merchant_name: "POS",
            merchant_id: "62",
            client_id: "b2895265-fbd5-465e-a4cb-68270f74394b",
        }
        const header = {
            Authorization: `Bearer 88e786c1-a1d1-4c72-8a22-8703675d50cc`
        };

        try {
            const gcashResponse = await axios.post(gcashApiUrl, gcashData, { headers: header });

            const depositFund = await TransactionModel.create({
                player_id,
                amount,
                wallet_id,
                transaction_type: "Deposit",
                transaction_id: transaction_id,
                gateway_payment: gateway_payment,
                status: "PENDING"
            })

            if (gcashResponse.data.status === 1) {
                const gcashResponseReturn = gcashResponse.data.data;
                const insertGcashLogRow = await GcashLogsModel.create({
                    user_id: gcashResponseReturn.user_id,
                    amount: gcashResponseReturn.amount,
                    merchant_id: gcashResponseReturn.merchant_id,
                    order_id: gcashResponseReturn.order_id,
                    create_time: gcashResponseReturn.create_time,
                    expiry_time: gcashResponseReturn.expiry_time,
                    function_name: gcashResponseReturn.function_name,
                    response_time: gcashResponseReturn.response_time,
                    request_id: gcashResponseReturn.request_id,
                    acquirement_id: gcashResponseReturn.acquirement_id,
                    checkout_url: gcashResponseReturn.checkout_url,
                    status: gcashResponseReturn.status
                })
                return gcashResponseReturn.checkout_url;
            }

        } catch (error) {
            console.error(error)
            throw new Error("Failed to initiate deposit");
        }
    }
}

async function transactionHistory(player_id) {
    try {
        const transactionList = await TransactionModel.findAll({
            where: {
                player_id: player_id
            }
        });
        return transactionList;
    } catch (error) {
        console.error(error)
    }

}

async function AffiliationBalancetransfer(player_id, amount) {
    try {
        const balanceWithdraw = await Affiliation.findOne({
            where: {
                player_id: player_id
            },
            attributes: ['affiliation_balance', 'wallet_id']
        });

        const current_balance = balanceWithdraw.dataValues.affiliation_balance;
        const walletID = balanceWithdraw.dataValues.wallet_id

        if (current_balance < amount) {
            throw new Error("Insufficient balance for the transfer");
        }

        const updatedBalance = parseInt(current_balance - amount, 10);

        await TransactionModel.create({
            player_id: player_id,
            amount: amount,
            wallet_id: walletID,
            transaction_type: "affiliation balance to wallet",
            transaction_id: generateTransferId(),
            gateway_payment: "NA",
            status: "SUCCESS"
        });

        await Affiliation.update({ affiliation_balance: updatedBalance }, {
            where: {
                player_id: player_id
            }
        });

        const findWallet = await Wallet.findOne({
            where: {
                player_id: player_id
            }
        })

        const currentWalletBalance = findWallet.dataValues.wallet_balance
        const updatedWallet = parseInt(currentWalletBalance + amount, 10)

        const walletDataBalance = await Wallet.update({ wallet_balance: updatedWallet }, {
            where: {
                player_id: player_id
            }
        })

        return walletDataBalance

    } catch (error) {
        console.error(error);
    }
}

async function walletBalance(player_id) {
    try {
        const userWalletBalance = await Wallet.findOne({
            where: {
                player_id: player_id
            },
            attributes: ['wallet_balance']
        });
        return userWalletBalance;
    } catch (error) {
        console.error(error)
    }

}

module.exports = { depositUserWallet, transactionHistory, walletBalance, AffiliationBalancetransfer }