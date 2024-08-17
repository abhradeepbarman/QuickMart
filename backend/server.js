const express = require("express");
const app = express();
const cors = require("cors");
const { dbConnect } = require("./config/db");
require("dotenv").config();

//database connect
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
