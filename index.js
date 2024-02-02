require("dotenv").config();
const express = require("express")
const port = process.env.PORT
const http = require('http');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { initializeSocket } = require('./socket');
const app = express()
const ipAddressModel = require("./models/IpAddressModel")

const server = http.createServer(app);

const CorsMiddleware = require("./middlewares/CorsMiddleware")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

const Authentication = require("./routers/clientSide/Authentication");
const gcashCashinApi = require("./routers/clientSide/gcashCashinAPI");
const gcashNotificationApi = require("./routers/clientSide/GcashNotificationAPI");
const redirectEGames = require("./routers/gameSide/breddasRedirectGamesRouter");
const gameWalletIntegration = require("./routers/gameSide/breddasGamesRouter");
const userDataProfile = require("./routers/clientSide/userDataProfile")
const cookieParser = require('cookie-parser');

app.use(cookieParser())

// Enable trust for headers set by proxies, such as X-Forwarded-For.
// This ensures that Express uses the correct client IP address when the app is behind a proxy.
// It enhances security and proper handling of client information.
app.set('trust proxy', true);

//HEADERS FOR SECURITY MEASURES
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.setHeader('Content-Security-Policy', 'default-src \'self\'');
    next();
});

// RATE LIMITER TO AVOID BEING CONGESTED
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Apply to all routes
app.use(limiter);

app.use("/api", CorsMiddleware, Authentication, gcashCashinApi, gcashNotificationApi, userDataProfile);

app.use("/redirect", redirectEGames);
app.use("/", gameWalletIntegration);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use(async (req, res, next) => {
    const ipAddress = req.headers['x-forwarded-for'];
    try {
      // Save the IP address to the database
      await ipAddressModel.create({ ipAddress: ipAddress });
    } catch (error) {
      console.error('Error saving IP address to database:', error);
    }
  
    next();
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    const errorMessage = `Unhandled Rejection at: ${promise}, reason: ${reason}`;
    console.error(errorMessage);
});

initializeSocket(server);

server.listen(port, () => {
    console.log(`App is listening ${port}`)
})