module.exports = {
    config: {

        service: 'gmail',
        secure: false,
        auth: {
            user: 'sender_mail@gmail.com',
            pass: 'password'
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    receiver: "receiver_mail.com"
};