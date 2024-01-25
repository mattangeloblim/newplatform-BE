const generateOTP = () => {
    // Generate a random 6-digit OTP
    const otpLength = 6;
    let otpCode = '';

    for (let i = 0; i < otpLength; i++) {
        otpCode += Math.floor(Math.random() * 10);
    }

    return otpCode;
}

module.exports = generateOTP;