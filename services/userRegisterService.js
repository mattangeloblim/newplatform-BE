const User = require("../models/UserModel");
const Affiliation = require("../models/AffiliationModel");
const Wallet = require("../models/WalletModel");
const OTP = require("../models/OTPModel");
const { Op } = require("sequelize")
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require('uuid');
const { generateAffiliationToken, generateWalletId } = require("../utils/TokenGenerated");
const generateOTP = require("../utils/OTP")

async function registerUserService(userData) {

    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { username: userData.username },
                { email: userData.email }
            ]
        }
    });

    if (existingUser) {
        throw new Error("Username or email already exists");
    }

    const wallet_id = generateWalletId();

    const player_id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const inputToken = userData.token

    const findAffiliation = await Affiliation.findOne({
        where: {
            token: inputToken
        },
        attributes: ['affiliate_count']
    })

    const currentCount = findAffiliation.dataValues.affiliate_count + 1

    await Affiliation.update({ affiliate_count: currentCount }, {
        where: {
            token: inputToken
        }
    })

    const user = await User.create({ ...userData, player_id, password: hashedPassword, referral_token: inputToken });
    await createAffiliation(player_id, wallet_id);
    await connectWallet(player_id, wallet_id)

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
        text: `Dear ${Name},\n\nThank you for registering! To verify your account, please verify your account using this code ${OTP}`,
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

async function createAffiliation(player_id, wallet_id) {
    const affiliation_token = generateAffiliationToken();
    const affiliation_percentage = 1;

    // Additional properties for the Affiliation model
    const affiliationData = {
        player_id,
        wallet_id: wallet_id,
        token: affiliation_token,
        affiliation_percentage,
        affiliation_balance: 0,
        affiliate_count: 0,
    };

    // Create the affiliation row
    await Affiliation.create(affiliationData);
}

async function connectWallet(player_id, wallet_id) {

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
        OTP: otps,
        account
    }

    await OTP.create(OTPData);
}

async function verifyUserService(verificationData) {
    const { player_id, otpsent } = verificationData

    const verifyUser = await OTP.findOne({
        where: {
            player_id: player_id,
            OTP: otpsent
        }
    })
    if (!verifyUser) {
        throw new Error("Wrong OTP");
    }

    await User.update(
        { isVerified: 1 },
        {
            where: {
                player_id: player_id
            }
        }
    )
}

module.exports = {
    registerUserService,
    verifyUserService
};
