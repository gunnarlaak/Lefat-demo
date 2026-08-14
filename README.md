# Lefat OÜ – Mootorid & Käigukastid

Esimene töötav veebiversioon.

## Kiire eelvaade
Ava `index.html` brauseris. Broneerimisvorm töötab demorežiimis ja salvestab sisestused brauseri localStorage'i.

## Google Calendar ühendus
Projektis on `server.js` näidisbackend. Selle aktiveerimiseks on vaja Google Cloudis Calendar API seadistust ning kalendrit, millele teenusekonto on saanud muutmisõiguse.

1. Paigalda Node.js.
2. Terminalis projekti kaustas: `npm install`
3. Kopeeri `.env.example` nimega `.env` ja lisa õiged Google'i väärtused.
4. Jaga soovitud Google Calendar teenusekonto e-posti aadressiga ning anna sellele sündmuste muutmise õigus.
5. Käivita: `npm start`
6. Ava `http://localhost:3000`

## Enne päris avaldamist
- lisa õige e-post, kui ettevõttel see on;
- lisa täpne aadress või Google Maps link;
- kinnita lahtiolekuajad;
- asenda hero taust päris töökoja fotoga;
- määra teenuste tegelikud kestused ja vabad ajad;
- lisa privaatsustingimused, kui vorm kogub kliendiandmeid.
