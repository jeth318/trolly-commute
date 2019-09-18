import { getDistance } from 'geolib';

export const getUserCoordinates = () => {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    var crd = pos.coords;
    return {
      latitude: crd.latitude,
      longitude: crd.longitude
    };
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    return err;
  }
  
  return navigator.geolocation.getCurrentPosition(success, error, options);
 };
