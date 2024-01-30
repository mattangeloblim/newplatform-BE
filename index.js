require("dotenv").config();
const express = require("express")
const port = process.env.PORT
const http = require('http');
const helmet = require('helmet');
const morgan = require('morgan');
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

app.use("/api", CorsMiddleware, Authentication, gcashCashinApi, gcashNotificationApi);

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