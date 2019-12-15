import dotenv from 'dotenv';
dotenv.config();
const { protocol, hostname } = document.location;
const isLocalhost = hostname === 'localhost'; 

export const allStopsUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json';
export const locationBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=';
export const tripBaseUrl = 'https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=';
export const tokenUrl = isLocalhost ? '/api/token' : `${protocol}//${hostname}/api/token`;