import * as _ from 'lodash';
import { LegsRaw } from '../InterfaceCollection';
import { FetchRequest, RequestMethod } from '../utils/request-builder';
import { getDistance } from 'geolib';

const getPosition = (options?) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

let userPosition = {
  latitute: 0,
  longitude: 0
};

getPosition()
  .then((position: any) => {
    console.log(position);
      userPosition.latitute = position.coords.latitude;
      userPosition.longitude = position.coords.longitude;
  })
  .catch((err) => {
    console.error(err.message);
  });



export default class API {

  async GetStopLocations(search: String) {
    const response = await FetchRequest('/api/stops', RequestMethod.POST, { search }, true);
    const data = await response.json();
    const stopLocations = _.take(this.sortByWeight(data.searchResponse), 15);
    // Sort by popularity (weight) and limit to 15 results
    const stopArraySemantic = _.map(stopLocations, (stopLocation: any) => {
      stopLocation.key = stopLocation._id;
      stopLocation.title = stopLocation.name;
      stopLocation.description = stopLocation.city;

      const distance = getDistance(
        { latitude: stopLocation.lat, longitude: stopLocation.lon},
        { latitude: userPosition.latitute, longitude: userPosition.longitude }
      );

      if (distance < 300) {
        stopLocation.price =  distance + ' m' + ' 📍'
      } else {
        stopLocation.price = Math.round(distance/1000 * 10 ) / 10  + ' km' + ' 📍';
      }

      return stopLocation;
    });
    return { stopLocations: stopArraySemantic, searchId: data.searchId };
  }
  
  async GetTrips(fromId: string, toId: string) {
    const response = await FetchRequest('/api/trips', RequestMethod.POST, { origin: fromId, destination: toId }, true);
    const data = await response.json();
    let legs: LegsRaw[] = data.TripList.Trip;
    let legsCleaned = _.map(legs, (trip: LegsRaw) => Array.isArray(trip.Leg) ? trip : { Leg: [trip.Leg] });
    return legsCleaned;
  }

  private sortByWeight(stopLocations: any) {
    return _.sortBy(stopLocations, ['weight']).reverse();
  }
}