const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/signup.html");
});



app.post("/", (req, res) =>{
    const email = req.body.mail;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            } 
        ]
    };
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    
    const url = 'https://us11.api.mailchimp.com/3.0/lists/28c106d8bb';

    const options = {
        method: 'POST',
        auth: 'moh:9509342ba5ebf305b588997117a6a9fd-us11'
    };

    const mailchimpRequest = https.request(url, options, (response)=>{
        console.log('statusCode:', response.statusCode);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });
    });
 
    mailchimpRequest.write(jsonData);
    mailchimpRequest.end();


});

// API KEY
// const apiKey = process.env.MAILCHIMP_API_KEY;

// AUDIENCE ID
// const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

app.listen(process.env.PORT || 3000, (err) =>{
    if (!err) {
        console.log("Le serveur fonctionne sur le port 3000");
    } else {
        console.log("Erreur dans le serveur : " + err);
    }
});
