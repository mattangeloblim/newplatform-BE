// routers/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const validatePhoneNumber = require('../../middlewares/phoneNumberValidation');

// Register User Route
router.post('/register/player', validatePhoneNumber, userController.registerUser);

router.post('/login/player', userController.loginUser);

router.post('/verify/player', userController.verifyUser);

module.exports = router;
