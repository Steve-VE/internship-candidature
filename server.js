let express = require("express");
let nodemailer = require('nodemailer');
const mailer_config = require('./mailer-transport-config');

let app = express();
let transporter = nodemailer.createTransport( mailer_config.config );

app.use('/assets', express.static('public'));

app.get('/', (request, response)=>{
    response.sendFile(__dirname + "/views/index.html");
});

app.get('/sendmail', (request, response)=>{
    console.log(request);
    const agrement = request.query.agrement;
    const name = request.query.name;
    const email = request.query.adress;
    const message = request.query.message;

    if(agrement === undefined || name === undefined || email === undefined || message === undefined){
        response.writeHead(400, { 
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*' // implementation of CORS
        });
        response.end('{"msg": "error"}'); // removed the 'callback' stuff
        return;
    }

    const mailOptions = {
        from: email,
        to: mailer_config.receiver,
        subject: "[Candidature - "+ agrement +"] - Ankama, de " + name,
        html: '<p>' + message + '</p>'
    };
    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err);
            transporter.close();
            response.writeHead(500, { 
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*' // implementation of CORS
            });
            response.end('{"msg": "error"}'); // removed the 'callback' stuff
        }
        else{
            transporter.close();
            response.writeHead(200, { 
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*' // implementation of CORS
            });
            response.end('{"msg": "mail sended"}'); // removed the 'callback' stuff
        }
    });
});

app.get('*', (request, response)=>{
    response.redirect('/');
});

app.listen(8080);