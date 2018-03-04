var dotenv = require('dotenv');
dotenv.config();
var tripBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=';
var tokenUrl = 'https://api.vasttrafik.se/token';
var allStopsUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json';
var vastTrafikUser = process.env.REACT_APP_VASTTRAFIK_KEY;
var vastTrafikSecret = process.env.REACT_APP_VASTTRAFIK_SECRET;
module.exports = {
    tripBaseUrl,
    tokenUrl,
    allStopsUrl,
    vastTrafikUser,
    vastTrafikSecret
}