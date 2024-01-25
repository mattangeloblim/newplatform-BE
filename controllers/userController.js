// controllers/userController.js
const userService = require('../services/userRegisterService');

async function registerUser(req, res) {
    try {
        const userData = req.body;
        const user = await userService.registerUser(userData);
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = {
    registerUser,
};
