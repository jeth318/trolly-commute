import * as _ from 'lodash';
import { LegsRaw } from '../InterfaceCollection';
import { FetchRequest, RequestMethod } from '../utils/request-builder';
import { getUserCoordinates } from '../utils/geolocation-util';
import { getDistance } from 'geolib';
const userLocation = navigator.geolocation.getCurrentPosition((data)=>data, (error=>error), {enableHighAccuracy: true});
console.log(userLocation);

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
      stopLocation.price = '90';
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