const User = require("../models/UserModel")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

async function loginUser(credentialsData, res) {
    const { username, password } = credentialsData;

    // Find the user by username
    const user = await User.findOne({
        where: {
            username: username
        }

    });

    if (!user) {
        throw new Error("Invalid username or password");
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid username or password");
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