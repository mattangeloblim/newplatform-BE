// controllers/userController.js
const registerService = require('../services/userRegisterService');
const userProfileService = require("../services/userProfileServices")
const loginService = require('../services/userLoginService');
const ipAddressModel = require("../models/IpAddressModel")
const useragent = require("useragent")

async function registerUser(req, res) {
    try {
        const userData = req.body;
        const user = await registerService.registerUserService(userData);
        const userIPAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || req.connection.remoteAgent;

        const agent = useragent.parse(userAgent);

        // Accessing the device type
        const deviceType = agent.device.toString();

        console.log(`User with username ${userData.username} logged in from IP address: ${userIPAddress} and ${userAgent} and device type ${deviceType}`);

        await ipAddressModel.create({
            user: userData.username,
            ipAddress: userIPAddress,
            action: 'Register'
        })

        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const credentialsData = req.body;
        const loginAuthenticate = await loginService.loginUser(credentialsData, res);
        const userIPAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || req.connection.remoteAgent;

        const agent = useragent.parse(userAgent);

        // Accessing the device type
        const deviceType = agent.device.toString();

        console.log(`User with username ${credentialsData.username} logged in from IP address: ${userIPAddress} and ${userAgent} and device type ${deviceType}`);

        await ipAddressModel.create({
            user: credentialsData.username,
            ipAddress: userIPAddress,
            action: 'Login'
        })

        res.status(200).json({ success: true, loginAuthenticate })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: error.message })
    }
}

async function verifyUser(req, res) {
    try {
        const verificationData = req.query
        await registerService.verifyUserService(verificationData, res)
        res.status(200).json({ success: true, message: "Verification Success" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: error.message })
    }
}

async function userProfile(req, res) {
    try {
        const user = req.user.uid
        const profile = await userProfileService.getUserProfile(user)
        res.status(200).json({ success: true, profile })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: error.message })
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    userProfile
};
