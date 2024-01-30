const User = require("../models/UserModel")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

// todoooooo: PREVENT THE USER FROM LOGGING IN USING DIFFERENT DEVICE AT THE SAME TIME
async function loginUser(credentialsData, res) {
    const { username, password } = credentialsData;

    // Find the user by username
    const user = await User.findOne({
        where: {
            username: username
        }

    });

    if (!user) {
        throw new Error("Invalid username");
    }
    if (user.isVerified !== 1) {
        throw new Error("User is not verified yet");
    }
    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    } else {

        const payload = {
            uid: user.player_id,
            username: user.username,
            email: user.email,
            number: user.number,
            phone: user.phone,
            user_type: user.user_type,
            birthdate: user.birthdate,
            referral_token: user.referral_token ? user.referral_token : null,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "8h",
        });

        res.setHeader("Authorization", `Bearer ${token}`)

        return token
    }
}

module.exports = {
    loginUser
};