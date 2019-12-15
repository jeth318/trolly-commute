const dotenv = require('dotenv');
const qs = require('qs');
dotenv.config();

const tripBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=';
const tokenUrl = 'https://api.vasttrafik.se/token';
const allStopsUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json';
const locationBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=';
const vastTrafikUser = process.env.VASTTRAFIK_KEY;
const vastTrafikSecret = process.env.VASTTRAFIK_SECRET;

const tokenConfig = {
    url: tokenUrl,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify({
        'client_id': vastTrafikUser,
        'client_secret': vastTrafikSecret,
        'grant_type': 'client_credentials'
    })
 };

module.exports = { 
    tripBaseUrl,
    tokenUrl,
    allStopsUrl,
    locationBaseUrl,
    vastTrafikUser,
    vastTrafikSecret,
    tokenConfig
};