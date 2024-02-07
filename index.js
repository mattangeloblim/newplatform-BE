require("dotenv").config();
const express = require("express")
const port = process.env.PORT
const http = require('http');
const helmet = require('helmet');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
const { initializeSocket } = require('./socket');
const app = express()

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
const PlatformTransaction = require("./routers/clientSide/PlatformTransaction")
const cookieParser = require('cookie-parser');


// ADMIN BACKOFFICE
const adminLoginRoute = require("./routers/adminSide/adminLoginRoute")

app.use(cookieParser())

// Set trust proxy to only trust the X-Forwarded-For header from a specific IP address or network.
// Adjust the 'loopback' value based on your deployment environment.
// app.set('trust proxy', '127.0.0.1')

//HEADERS FOR SECURITY MEASURES
app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.setHeader('Content-Security-Policy', 'default-src \'self\'');
    next();
});

// // RATE LIMITER TO AVOID BEING CONGESTED
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
// });

// // Apply to all routes
// app.use(limiter);

app.use("/api", CorsMiddleware, Authentication, gcashCashinApi, gcashNotificationApi, userDataProfile, PlatformTransaction, adminLoginRoute);

app.use("/redirect", redirectEGames);
app.use("/", gameWalletIntegration);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
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