import dotenv from 'dotenv';
dotenv.config();

export const tripBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=';
export const tokenUrl = 'https://api.vasttrafik.se/token';
export const allStopsUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json';
export const locationBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=';
export const vastTrafikUser = process.env.REACT_APP_VASTTRAFIK_KEY;
export const vastTrafikSecret = process.env.REACT_APP_VASTTRAFIK_SECRET;
//console.log(process.env);