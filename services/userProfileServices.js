// userProfileService.js
const User = require('../models/UserModel');

const getUserProfile = async (player_id) => {
    try {
        const user = await User.findOne({
            where: {
                player_id: player_id
            }
        });
        if (!user) {
            throw new Error('User not found');
        }

        return user

    } catch (error) {
        throw new Error('Failed to fetch user profile');
    }
};

module.exports = { getUserProfile };