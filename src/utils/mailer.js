const nodemailer = require("nodemailer");
// require('dotenv').config({ path: `${__dirname}/../.env` })

async function mailer(info) {

    let transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USERNAME,
            pass: process.env.NODEMAILER_PASSWORD
        },
    });
    await transporter.sendMail({
        ...info
    });
}

module.exports = mailer