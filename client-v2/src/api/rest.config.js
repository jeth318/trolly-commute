const protocol = document.location.protocol;
const hostname = document.location.hostname;
const isLocalhost = hostname === 'localhost';

console.log(isLocalhost);


export const tripsUrl = isLocalhost ? '/trips' : `${protocol}//${hostname}/api/trips`;
export const stopLocationsUrl = isLocalhost ? '/stop-locations' : `${protocol}//${hostname}/api/stop-locations`;