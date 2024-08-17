const mongoose = require("mongoose");

exports.dbConnect = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((e) => console.log("DB connection successful: ", e.connection.host))
        .catch((err) => console.log("DB connection error", err));
};
