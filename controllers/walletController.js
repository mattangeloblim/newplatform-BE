const walletService = require("../services/userWalletService")

async function depositUserWalletController(req, res) {
    try {
        const keyData = req.query
        const player_id = req.user.uid;
        const { amount } = req.body

        const checkoutUrl = await walletService.depositUserWallet(keyData, player_id, amount)

        res.status(200).json({ message: "Deposit initiated successfully", checkoutUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { depositUserWalletController }