import dotenv from 'dotenv';
dotenv.config();
const PROTOCOL = document.location.protocol;
const HOSTNAME = document.location.hostname;

console.log(`${PROTOCOL}//${HOSTNAME}:3001/api/token`);

export const tripBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=';
export const tokenUrl = `${PROTOCOL}//${HOSTNAME}:3001/api/token`;
export const allStopsUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json';
export const locationBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=';