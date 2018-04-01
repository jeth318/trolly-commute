const firebase = require('firebase');
import * as _ from 'lodash';
import { LegsRaw } from '../InterfaceCollection';

export default class API {

  GetStopLocations = (search: String) => {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'POST',
        body: JSON.stringify({ search: search}),
        headers:  {
          'content-type': 'application/json; charset=utf-8'
        }
      }
      fetch('/api/stops', options)
        .then((res: Response) => res.json())
        .then((data: any) => {
          // Sort by popularity (weight) and limit to 15 results
          let stopLocations = _.take(this.sortByWeight(data.searchResponse), 15);
          let stopArraySemantic = _.map(stopLocations, (stopLocation: any) => {
            stopLocation.key = stopLocation._id;
            stopLocation.title = stopLocation.name;
            stopLocation.description = stopLocation.city;
            return stopLocation;
          })
          resolve({stopLocations: stopArraySemantic, searchId: data.searchId});
        });
    })
  }
  
  GetTrips = (fromId: string, toId: string) => {
    let options = {
      method: 'POST',
      body: JSON.stringify({ origin: fromId, destination: toId }),
      headers:  {
        'content-type': 'application/json; charset=utf-8'
      }
    }
    return new Promise((resolve, reject) => {
      fetch('/api/trips', options)
        .then((response) => response.json())
        .then((res) => {
          let legs: LegsRaw[] = res.TripList.Trip;
          let legsCleaned = _.map(legs, (trip: LegsRaw) => {
            return Array.isArray(trip.Leg) ? trip : { Leg: [trip.Leg] };
          });
          return resolve(legsCleaned);
        })
        .catch((err)=>console.error(err))
    });
  }

  // Stores travelinformation in firebase.
  StoreSearchInformation = (fromId: string, toId: string) => {
    return new Promise((resolve, reject) => {
      let time = new Date().toUTCString();
      let ref = firebase.database().ref();
      let messageRef = ref.child('trip-searches');

      try {
        messageRef.push({
          time: time,
          from: fromId,
          to: toId
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  private sortByWeight(stopLocations) {
    return _.sortBy(stopLocations, ['weight']).reverse();
  }
}