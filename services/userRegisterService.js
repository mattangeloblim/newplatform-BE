const User = require("../models/UserModel")
const Affiliation = require("../models/AffiliationModel")
const Wallet = require("../models/WalletModel")
const OTP = require("../models/OTPModel")
const nodemailer = require('nodemailer');

const { v4: uuidv4 } = require('uuid');
const { generateAffiliationToken, generateWalletId } = require("../utils/TokenGenerated");
const generateOTP = require("../utils/OTP")

async function registerUser(userData) {

    const player_id = uuidv4();
    const user = await User.create({ ...userData, player_id });
    await createAffiliation(player_id);
    await connectWallet(player_id)

    const player_email = userData.email;
    const Name = userData.name
    const OTP = generateOTP()

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "foodbud4@gmail.com", // Your email address
            pass: "rajt zlul xrjx zani", // Your email password
        },
    });

    const mailOptions = {
        from: "foodbud4@gmail.com",
        to: player_email,
        subject: "Registration Successful",
        text: `Dear ${Name},\n\nThank you for registering! To verify your account, please verify using this code ${OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Error sending email" });
        } else {
            const account = "email"
            saveOTP(player_id, OTP, account)
            console.log("Email sent: " + info.response);
        }
    });

    return user;
}

async function createAffiliation(player_id) {
    const affiliation_token = generateAffiliationToken();
    const affiliation_percentage = 1;

    // Additional properties for the Affiliation model
    const affiliationData = {
        player_id,
        token: affiliation_token,
        affiliation_percentage,
        affiliation_balance: 0,
        affiliate_count: 0,
    };

    // Create the affiliation row
    await Affiliation.create(affiliationData);
}

async function connectWallet(player_id) {
    const wallet_id = generateWalletId();

    const walletData = {
        player_id,
        wallet_id,
    }

    await Wallet.create(walletData);
}

async function saveOTP(player_id, otps, account) {
    // const wallet_id = generateWalletId();

    const OTPData = {
        player_id,
        OTP:otps,
        account
    }

    await OTP.create(OTPData);
}

module.exports = {
    registerUser
};
