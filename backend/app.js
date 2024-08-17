const express = require("express");
const app = express();
const cors = require("cors");
const { logger } = require("./logger")
const morgan = require("morgan")
const authRoutes = require("./routes/auth.routes");


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
        stream: {
        write: (message) => {
            const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
            };
            logger.info(JSON.stringify(logObject));
        },
        },
    })
);

//routes
app.use("/api/v1/auth", authRoutes);

module.exports = app;
