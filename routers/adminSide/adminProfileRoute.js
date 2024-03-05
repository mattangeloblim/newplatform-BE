const express = require("express");
const router = express.Router();
const { getUserDeposit, getUserWithdrawal } = require('../../controllers/adminSideProfileController');

// Routes
router.get('/admin/profile/deposit', getUserDeposit);
router.get('/admin/profile/withdrawal', getUserWithdrawal);

module.exports = router;