const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user : 'pleasedonthackmymails@gmail.com',
        pass : process.env.SMTP_PASS
    }
})


const sendWelcomeEmail = (email, name) => {
    const mailOptions = {
        from : 'pleasedonthackmymails@gmail.com',
        to : email,
        subject : 'Thanks for joining in!',
        text : `Welcome to the App, ${name}. Let me know how you get along with the app.`
    }

    transporter.sendMail(mailOptions)
}

const sendCancellationEmail = (email, name) => {
    const mailOptions = {
        from : 'pleasedonthackmymails@gmail.com',
        to : email,
        subject : 'Sorry to see you go!',
        text : `Goodbye ${name}. Hope to see you back sometime soon.`
    }
    transporter.sendMail(mailOptions)
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}