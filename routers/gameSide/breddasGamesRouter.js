const express = require("express")
const router = express.Router()
const Wallet = require("../../models/WalletModel")
const crypto = require('crypto');

function generateHash(user_id, token) {
    const secretKey = 'breddas-key'; // Replace with your actual secret key
    const sortedParams = { user_id, token };
    const sortedKeys = Object.keys(sortedParams).sort();
    const paramString = sortedKeys.map(key => `${key}=${sortedParams[key]}`).join('&');
    const hashString = `${paramString}${secretKey}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex');
    return hash;
}

router.get("/bingo-games/wallet", async (req, res) => {
    try {
        let { user_id, token, hash } = req.query;
        const hashgenerated = generateHash(user_id, token);

        hash = hashgenerated;

        const userWallet = await Wallet.findOne({
            where: {
                player_id: user_id
            },
            attributes: ['wallet_balance']
        });

        // Include the hash in the response
        res.json({
            currency: "PHP",
            balance: userWallet ? userWallet.wallet_balance : 0,
            userId: user_id,
            status: "Success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router