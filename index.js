const express = require('express')
const { google } = require('googleapis');

const app = express();

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const oauth2 = new google.auth.OAuth2(
    '118636087936-i3k01ghilc72d6e9997g4sq8hk1civth.apps.googleusercontent.com',
    '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',
    'http://localhost:5000/redirect'
)

const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    include_granted_scopes: true
})
var userCredential = null;

app.get('/init', async (req, res, next) => {
    res.writeHead(301, { 'Location': authUrl });
    res.end();
})

app.get('/redirect', async (req, res) => {
    const query = req.query;

    try {
        if (query.error) {
            throw new Error(query.error)
        } else {
            const response = await oauth2.getToken(query.code);
            oauth2.setCredentials(response.tokens);

            userCredential = response.tokens;
            
            const calendar = google.calendar('v3');
            const result = await calendar.events.list({
                calendarId: 'primary',
                auth:oauth2,
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            });
            const events = result.data.items;
            if(!events || events.length === 0){
                console.log('No upcoming events found');
                res.send('no events found')
            }else{
                const list = events.map((event, i)=> {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                    return `${start} - ${event.summary}`;
                })                
                res.status(200).json({eventsList: list});
            }
        }

    }catch(error){
        res.status(401).send(error)
    }
})
// app.get('/', (req, res) => {
//     calendar.events.list({
//         calendarId: GOOGLE_CALENDAR_ID,
//         timeMin: (new Date()).toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: 'startTime',

//     }, (error, result) => {
//         if (error) {
//             res.send(JSON.stringify({ error: error }));
//         } else {
//             if (result.data.items.length) {
//                 res.send(JSON.stringify({ events: result.data.items }))
//             } else {
//                 res.send(JSON.stringify({ message: 'No upcoming events found' }));
//             }
//         }
//     })
// })

app.listen(5000, () => console.log("App server connected on 5000 port"));

