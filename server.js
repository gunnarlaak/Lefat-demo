// Google Calendar backend scaffold.
// Vajab: npm i express cors dotenv googleapis
// .env failis:
// GOOGLE_CALENDAR_ID=...
// GOOGLE_SERVICE_ACCOUNT_EMAIL=...
// GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"

const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('.'));

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar']
});
const calendar = google.calendar({ version: 'v3', auth });

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

app.post('/api/book', async (req, res) => {
  try {
    const b = req.body;
    if (!b.service || !b.car || !b.reg || !b.problem || !b.date || !b.time || !b.name || !b.phone) {
      return res.status(400).json({error:'Puuduvad kohustuslikud väljad'});
    }
    const start = new Date(`${b.date}T${b.time}:00+03:00`);
    const end = addMinutes(start, 60);

    // Kontrollib kattuvaid sündmusi.
    const freeBusy = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }]
      }
    });
    const busy = freeBusy.data.calendars?.[process.env.GOOGLE_CALENDAR_ID]?.busy || [];
    if (busy.length) return res.status(409).json({error:'See aeg on juba hõivatud'});

    const description = [
      `Klient: ${b.name}`,
      `Telefon: ${b.phone}`,
      b.email ? `E-post: ${b.email}` : '',
      `Auto: ${b.car}`,
      `Reg nr: ${b.reg}`,
      b.year ? `Aasta: ${b.year}` : '',
      b.mileage ? `Läbisõit: ${b.mileage}` : '',
      '',
      `Probleem: ${b.problem}`
    ].filter(Boolean).join('\n');

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `🔧 ${b.service} – ${b.car} – ${b.reg}`,
        description,
        start: { dateTime: start.toISOString(), timeZone: 'Europe/Tallinn' },
        end: { dateTime: end.toISOString(), timeZone: 'Europe/Tallinn' }
      }
    });
    res.json({ok:true, eventId:event.data.id});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'Broneeringu salvestamine ebaõnnestus'});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lefat veeb töötab: http://localhost:${port}`));
