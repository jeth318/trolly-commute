const protocol = document.location.protocol;
const hostname = document.location.hostname;
const isLocalhost = hostname === 'localhost';

console.log(isLocalhost);


export const tripsUrl = isLocalhost ? '/api/trips' : `${protocol}//${hostname}/api/trips`;
export const stopLocationsUrl = isLocalhost ? '/api/stop-locations' : `${protocol}//${hostname}/api/stop-locations`;