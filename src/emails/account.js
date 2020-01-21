const sgMail =  require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail =   (email, name) => {
    sgMail.send({
        to : email, 
        from : 'pleasedonthackmymails@gmail.com',
        subject : 'thanks for joining in!',
        text :`welcome to the app, ${name}. let me know how you get along with the app `
    })
}

const sendCancelEmail =   (email, name) => {
    sgMail.send({
        to : email, 
        from : 'pleasedonthackmymails@gmail.com',
        subject : 'thank you for using our services!',
        text :`${name} please let us know your experience and what we could not help you with `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}