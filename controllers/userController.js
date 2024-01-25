// controllers/userController.js
const registerService = require('../services/userRegisterService');
const loginService = require('../services/userLoginService');

async function registerUser(req, res) {
    try {
        const userData = req.body;
        const user = await registerService.registerUser(userData);
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function loginUser(req,res){
    try {
        const credentialsData = req.body;
        const loginAuthenticate = await loginService.loginUser(credentialsData, res)

        res.status(200).json({success: true, loginAuthenticate})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({succes:false, error: error.message})
    }
}

module.exports = {
    registerUser,
    loginUser
};
