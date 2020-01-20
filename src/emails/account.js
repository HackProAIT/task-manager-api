const sgMail =  require('@sendgrid/mail')

sgMail.setApiKey('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')

//sgMail.setApiKey('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')

// const sendWelcomeEmail =   (email, name) => {
//     //console.log(sendgridAPIKey)
//     sgMail.send({
//         to : email, 
//         from : 'pleasedonthackmymails@gmail.com',
//         subject : 'thanks for joining in!',
//         text :`welcome to the app, ${name}. let me know how you get along with the app `
//     })
// }

// const sendCancelEmail =   (email, name) => {
//     sgMail.send({
//         to : email, 
//         from : 'pleasedonthackmymails@gmail.com',
//         subject : 'thank you for using our services!',
//         text :`${name} please let us know your experience and what we could not help you with `
//     })
// }


sgMail.send({
    to : 'pleasedonthackmymails@gmail.com',
    from : 'pun.unipune.ac.in@someoneisfuckingwithyou',
    subject : 'EGR online exam ',
    text : 'it has been found that you have already failed in EGR offline exam in you re-exam so you cannot attemp EGR online exam, for more details please concern your administration'
})

// module.exports = {
//     sendWelcomeEmail,
//     sendCancelEmail
// }