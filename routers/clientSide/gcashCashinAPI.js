const express = require("express")
const router = express.Router()
const walletController = require("../../controllers/walletController")
const verifyToken = require("../../middlewares/AuthMiddleware")

router.post("/player/deposit", verifyToken, walletController.depositUserWalletController);

module.exports = router