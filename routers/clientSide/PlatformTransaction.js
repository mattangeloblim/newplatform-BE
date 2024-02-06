const express = require("express")
const router = express.Router()
const walletController = require("../../controllers/walletController")
const Authentication = require("../../middlewares/AuthMiddleware")

router.post("/affiliation/funds/transfer", Authentication, walletController.transferAffiliationBalanceController)

module.exports = router