import nodemailer from 'nodemailer';
import fs from 'fs';
import { dirname } from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
// D:\Alfez\gaois-backend\mail-template.html
// import mailtemplate from'';
// const nodemailer = require('nodemailer');
export function sendEmail(formData) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gaoistudies@gmail.com', // your email address
            pass: 'zxqucmgpelonbseq' // your email password or application-specific password
        }
    });

    const mailOptions = {
        from: 'Ghause Azam Online Islamic Studies <ghauseazamonlineislamicstudies@gmail.com>', // sender address
        to: 'ghauseazamonlineislamicstudies@gmail.com,gaoistudies@gmail.com ', // recipient address
        subject: 'New Form Submission',
        text: `New form submission : ${JSON.stringify(formData, null, 2)}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
export function sendEmailtoStudent(recipientEmail, recipientName) {

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    // const manualTemplate = fs.readFileSync(, 'utf-8');

    // const manualTemplate = ;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    console.log(__dirname);
    // return;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gaoistudies@gmail.com', // your email address
            pass: 'zxqucmgpelonbseq' // your email password or application-specific password
        }
    });

    readHTMLFile('./mail-template.html', function (err, html) {
        if (err) {
            console.log('error reading file', err);
            return;
        }
        var template = Handlebars.compile(html);
        var replacements = {
            recipientName: recipientName
        };

        var htmlToSend = template(replacements);
        const mailOptions = {
            from: 'Ghause Azam Online Islamic Studies <gaoistudies@gmail.com>', // sender address
            to: recipientEmail, // recipient address
            subject: 'New Form Submission',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}

