// middlewares/validatePhoneNumber.js
function validatePhoneNumber(req, res, next) {
    const { phone } = req.body;
    const philippinePhoneNumberRegex = /^(\+?63|0)?[9]\d{9}$/;
  
    if (!philippinePhoneNumberRegex.test(phone)) {
      return res.status(400).json({ success: false, error: 'Invalid Philippine phone number format' });
    }
  
    next();
  }
  
  module.exports = validatePhoneNumber;
  