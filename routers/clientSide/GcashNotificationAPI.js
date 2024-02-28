const express = require("express")
const router = express.Router()
const moment = require('moment-timezone');
const GcashLogsModel = require("../../models/GcashLogsModels")
const TransactionModel = require("../../models/TransactionModel")
const WalletModel = require("../../models/WalletModel")
const { emitWalletUpdate } = require("../../socket")


router.post("/gcash/notification-url", async (req, res) => {
    try {
        const { acquirement_id, amount, order_id, status, user_id } = req.body;

        if (status !== "SUCCESS" && status !== "INIT" && status !== "CLOSED") {
            return res.status(400).json({ error: "Invalid 'status' value" });
        }

        const phTime = moment().tz('Asia/Manila').format("YYYY-MM-DD HH:mm:ss")

        const updateGcashRow = await GcashLogsModel.update(
            { status: status },
            {
                where:
                {
                    acquirement_id: acquirement_id,
                    order_id: order_id,
                    user_id: user_id
                }
            }
        );

        if (updateGcashRow[0] === 1) {
            await TransactionModel.update(
                { status: status },
                {
                    where: {
                        transaction_id: user_id
                    }
                }
            )

            const notificationResponse = {
                acquirement_id,
                amount,
                order_id,
                status,
                user_id,
                received_at: phTime
            }

            const TransactionRow = await TransactionModel.findOne({
                where: {
                    transaction_id: user_id
                }
            })


            if (status === "SUCCESS") {
                const userWalletId = TransactionRow.dataValues.wallet_id

                const findUserWallet = await WalletModel.findOne({
                    where: {
                        wallet_id: userWalletId
                    }
                })

                if (findUserWallet.dataValues.first_deposit_at === null) {
                    await findUserWallet.update({
                        first_deposit_at: phTime,
                        wallet_balance: findUserWallet.wallet_balance + parseFloat(amount),
                        overall_deposit: findUserWallet.overall_deposit + parseFloat(amount)
                    });
                } else {
                    await findUserWallet.update({
                        wallet_balance: findUserWallet.wallet_balance + parseFloat(amount),
                        overall_deposit: findUserWallet.overall_deposit + parseFloat(amount)
                    });
                }

                emitWalletUpdate(TransactionRow.player_id, findUserWallet.wallet_balance )
            }

            return res.status(200).json({ success: true, message: "Status updated successfully", notificationResponse });
        } else {
            // No rows were updated
            return res.status(404).json({ success: false, message: "Record not found" });
        }



    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})
module.exports = router