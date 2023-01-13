const express = require('express')
const {google} =require('googleapis');

const app = express();

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const GOOGLE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7BJc48+G8J/ve\nFHxNn7IQHo/GoHPNkqS7llrNhqiCy/XvQkK+E90hdTZBTRjamAANGOULgeungsq/\nPOmGXKS1z70ZeX20BkD9toJYvkzgVpdm0gN65bDU0FWPTBcylFptcjVARkrPGG7v\ntVC8MNNOfBtriaEFH5lDuQAvWfSb/VXmCOuld99VaK6rhULfI1LuUBdpDnk8zXK4\nnXQPrVrrloVFGc2erVcBeAJ2ZA4xdlFz/D1xGGaz0CnNjMIjTYVKE2cBciEtWF1d\nF/uBa9EBeW9OHNNs+smNPrkcgl7/m3bKxzntR5hzZvuyY58O91IpOeipeRK1Jx7F\ncPceg5VLAgMBAAECggEAC7FDlYXFHp/O76YoocXGB5uRi6HE4hzOYp5wFBqpXTwZ\nQGZl7wvye42gR1oY0rN47vJLThPgwuFUToglZYdUEokbBOu2maAs3tZS6FXfHCuH\nXbm41y2WVHsOAZG7slraG67UEeFGYUcUY7V0IPMm7IJDFWi0zrHLqEZ5v3wiGFp7\n6dQRACAZ3LpuN7xlpLqzeXzEX2lh0pM42lG7zuO76n1htXoVHOIj7MnPKJ+/vcJu\nqKDHAhuuOHTFv66Ny2ZI/C7gMMcDTlUPHkBybtBm+RYSUckxAJAVYDbX/p24MyOr\nR0KkI3uKSVDeErz8Ni/vMpYr8lzu0ByUC4wFte2FKQKBgQDw7eKYYFgMAxwJymME\nSqnDFphkPLocebp/JEZcQ/AUfuSdaTGILvUnJhjbJiUhrmwlGPOdKW+k9zunVVcp\n1yTIg0VwMgNqvPeRnXXiX2/ZIUcijCOHHkb+35DciG5f5ODbD576YymINPEoChDH\ndaz76/M+WnDtyxZKJ7zddSSYbwKBgQDGt2XqC0NDnmezYGbfTf1qpMHkhSbpyp5g\niIuKxIIIUb+ASm69CQBTAwmJQL6OsxzKb2/dEPjr3RtgML1n/e5O71MLll1AO5ks\naJpFQ4urgkNn+EX4/R/1ZS1+Ecpe5JsLAozjjPyNRdK4gQIl3Hu4j4mPH0FzfBQx\n0FgwyCVm5QKBgQCL81M9+jELAT9nPIYZ9xj3twdcqp3dbqRzuGmarOgnr7Iy8ekQ\n114WmJ21p0nIb95oCj9w2qH8rJSdVghkyJGYXBCY5KRxe0U/87yHe7Kn6Rm+KrN0\niJTq9ojaYfHjiDtJZKCPh8yXT1GKVZZ7lpKeX+gTH0wcBW10M/MUnThdxwKBgQCQ\nNf5vKHdLNkUZx2dAvW+gmirgNcV0u4fOlKl4Ln4TnYf1iY7t/v9OPxEHm4XvN4s4\nWkD7VNrhCRhZ6WU7d+wfOs2wxhGskNPrh4oVpBxTfnh+lo3pUYGE7EVkjXKpBQyD\no/ktFl8eA0MWhQFTCrx6xyhURqGQNsbNE988n7ONBQKBgCOybf8vrJknA3SQCUM2\nq/BBWDXC7j+q2L5u6tp5uNs+iI/70Ix16EwkeJZcLSf/ULAbwkgfHExYW+KUm9CT\nonTvekxgPMTJ8hW+hKi0KpInEm70jyjx0bcumdESWto5/v/G8FqJc7fOMRW3JffE\n/8Xeo7lREIescFCzrV2sM36D\n-----END PRIVATE KEY-----\n';
const GOOGLE_CLIENT_EMAIL= 'calender-key@gcalendar-374606.iam.gserviceaccount.com';
const GOOGLE_PROJECT_NUMBER = '256372074519';
const GOOGLE_CALENDAR_ID = 'da10eb5a8d6585737350475cf9634142a3fe6843113236324d2662d9319355eb@group.calendar.google.com';

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
);
const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

app.get('/', (req,res) => {
    calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',

    }, (error, result) => {
        if(error){
            res.send(JSON.stringify({error: error}));
        }else{
            if(result.data.items.length){
                res.send(JSON.stringify({events: result.data.items}))
            }else{
                res.send(JSON.stringify({ message: 'No upcoming events found'}));
            }
        }
    })
})

app.listen(5000, ()=> console.log("App server connected on 5000 port"));

