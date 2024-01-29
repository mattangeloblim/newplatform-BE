const generateAffiliationToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const tokenLength = 8;
    let affiliation_token = '';

    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        affiliation_token += characters.charAt(randomIndex);
    }

    return affiliation_token;
};

const generateWalletId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 6;

    let randomCharacters = '';
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCharacters += characters.charAt(randomIndex);
    }

    // Get the current timestamp
    const timestamp = new Date().getTime();

    // Concatenate timestamp with random characters
    const walletId = `${randomCharacters}${timestamp}`;

    return walletId;
};

const generateTransactionId = () => {
    const prefix = 'dp-';
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomString = Math.random().toString(36).substr(2, 5); // Generate a random string

    const uniqueString = `${prefix}${timestamp}${randomString}`;

    return uniqueString;
}

module.exports = { generateAffiliationToken, generateWalletId, generateTransactionId };