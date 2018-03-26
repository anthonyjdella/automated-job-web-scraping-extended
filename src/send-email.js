const nodemailer = require('nodemailer');
const fs = require("fs");
const smtpTransport = require('nodemailer-smtp-transport');
const credentials = require('./../util/credentials.js');


function emailModule() {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: credentials.email,
            pass: credentials.password
        }
    }));

    transporter.sendMail({
        from: credentials.email,
        subject: "DFW Job Alerts",
        text: "Hey, here are the new tech job postings around DFW: ",
        attachments: [
            {
                'filename': 'dfw-tech-jobs.html',
                'path': 'C:/Users/Anthony/Documents/git/automated-job-web-scraping-extended/dfw-tech-jobs.html'
            }
        ],
        to: credentials.email
    }, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        console.log("E-Mail sent successfully to " + credentials.email);
    });
}

module.exports = emailModule;