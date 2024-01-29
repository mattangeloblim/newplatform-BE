require("dotenv").config();
const express = require("express")
const port = process.env.PORT
const app = express()
const User = require("./models/UserModel")

const CorsMiddleware = require("./middlewares/CorsMiddleware")
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Authentication = require("./routers/clientSide/Authentication")
const gcashCashinApi = require("./routers/clientSide/gcashCashinAPI")
const gcashNotificationApi = require("./routers/clientSide/GcashNotificationAPI")

app.use("/api", CorsMiddleware, Authentication, gcashCashinApi, gcashNotificationApi)

app.listen(port, () => {
    console.log(`App is listening ${port}`)
})