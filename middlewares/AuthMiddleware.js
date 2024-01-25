require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "token is missing" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Invalid token", err);
      return res.status(401).json({
        message: "Unauthenticated", 
      });
    }
    req.user = decoded;

    console.log(req.user)
    next();
  });
}

module.exports = verifyToken;