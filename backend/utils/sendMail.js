const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

exports.mailSender = async ({receiver, subject, message}) => {
    try {
        const info = await transporter.sendMail({
            from: 'Amazon Team',
            to: receiver,
            subject: subject,
            html: message
        }) 

        if(info) {
            return info.messageId;
        }
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
};
