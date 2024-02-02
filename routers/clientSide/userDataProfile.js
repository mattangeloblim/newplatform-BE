const express = require('express');
const Authorization = require("../../middlewares/AuthMiddleware")
const userController = require('../../controllers/userController');

const router = express.Router();

router.get('/profile', Authorization, userController.userProfile);


module.exports = router;