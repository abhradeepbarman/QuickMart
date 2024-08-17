const { dbConnect } = require("./config/db");
require("dotenv").config();

// import app
const app = require("./app");

//database connect
dbConnect();

// connect server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
