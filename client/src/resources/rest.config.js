import dotenv from 'dotenv';
dotenv.config();
const PROTOCOL = document.location.protocol;
const HOSTNAME = document.location.hostname;
const isLocalhost = HOSTNAME === 'localhost'; 

export const allStopsUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json';
export const locationBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=';
export const tripBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=';
export const tokenUrl = isLocalhost ? '/api/token' : `${PROTOCOL}//${HOSTNAME}/api/token`;