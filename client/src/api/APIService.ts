const request = require('request');
const allstops = require('./allstops-sorted.json');
const firebase = require('firebase');
import * as _ from 'lodash';
import { LegsRaw } from '../InterfaceCollection';
import { mockTrip } from './mock';
import {
  tokenUrl,
  tripBaseUrl,
  vastTrafikUser,
  vastTrafikSecret,
  allStopsUrl
} from '../config';


export default class API {
  private accessToken: any;
  private attempts: any = 0;
  private headers = {'content-type': 'application/json'};
  constructor() {
    this.GetAccessToken()
    .then(()=>{
      return this.UpdateStops()
    })
    .then((newStops) => {
      return this.UpdateStopLocations(newStops)
    })
    .then(()=>{
      return console.log('Done!');
    })
  }

  UpdateStopLocations = (stops) => {
    console.log(stops)
    return fetch('/api',  {method: 'POST', headers: this.headers, body: JSON.stringify(stops)})
    .then((res: any)=>{
      return res.json()
    })
    .then((data)=>{
      return console.log(data);
    })
    .catch((err)=>console.log(err));
  }
  // Grabs accesstoken from Västtrafik
  GetAccessToken = () => {
    return new Promise((resolve, reject) => {
      let self = this;
      let options = {
        url: tokenUrl,
        method: 'POST',
        auth: {
          user: vastTrafikUser,
          pass: vastTrafikSecret
        },
        form: {
          grant_type: 'client_credentials'
        }
      };
      
      request(options, function (err: string, res: Response) {
          if (err) {
            reject(err);
          }
          let responseBody = res.body ? JSON.parse(res.body.toString()) : null;
          //this.accessToken = responseBody.acccessToken;
          self.accessToken = responseBody.access_token;
          resolve();
        }
      );
    });
  }

  UpdateStops() {
    const options = {
      url: allStopsUrl,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.accessToken
      }
    }
    return new Promise((resolve, reject)=>{
      request(options, (err, res)=>{
        let responseBody = JSON.parse(res.body.toString());
        let stops = responseBody.LocationList.StopLocation;
        let filteredByTrack = _.filter(stops, (s)=>!s.hasOwnProperty('track'));
        let sortedStops = _.sortBy(filteredByTrack, ['weight']).reverse();
        let cleanStops = _.map(sortedStops, (s)=>{
          s.name = _.capitalize(s.name);
          return s;
        });
         resolve(cleanStops);
      })
    })
    
  }
  // Browses local json containing all stoplocations. Returns a list of 15 locations
  GetAllStops = (search: String) => {
    return new Promise((resolve, reject) => {
      // Sorting all stoplocations based on 'weight property' (popularity).
      let stopArray = new Array();
      for (let i = 0; i < allstops.length; i++) {
        let stopLocation = allstops[i];
        let stopToUpper = stopLocation.name.toUpperCase();
        let stopTrack = stopLocation.track;

        if (stopToUpper.includes(search.toUpperCase()) && stopTrack == null) {
          stopArray.push(stopLocation);
        }
        if (stopArray.length === 15) {
          return;
        }
        resolve(stopArray);
      }
    });
  }

  // Performs a API-request to Västrafik, using accesstoken and searchparams
  GetTripFromSearch = (fromId: string, toId: string) => {
    return new Promise((resolve, reject) => {
      let url = tripBaseUrl + fromId + '&destId=' + toId + '&numTrips=10&format=json';
      request(
        {
          url: url,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + this.accessToken
          }
        },
        (err: any, res: any) => {
          if (err) {
            reject(err);
          } else {
            console.log(res.statusCode);
            console.log(this.attempts);
            if (this.attempts === 3)  {
              return resolve('Problem getting valid token')
            }
            if (res.statusCode === 401) {
              this.attempts++;
              this.GetAccessToken()
                .then((mess) => {
                  resolve(this.GetTripFromSearch(fromId, toId))
                });
              return null;
            }
            this.attempts = 0;
            console.log(res.body && JSON.parse(res.body.toString()));
            let responseBody = res.body ? JSON.parse(res.body.toString()) : '';
            let legs: LegsRaw[];
            legs = responseBody.TripList.Trip;
            let legsPretty: LegsRaw[] = [];

            legs.forEach((trip: LegsRaw) => {
              Array.isArray(trip.Leg) ? legsPretty.push(trip) : legsPretty.push({ Leg: [trip.Leg] });
            });
            return resolve(legsPretty);
          }
        }
      );

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

  GetMockAccessToken = () => {
    return new Promise((resolve, reject) => {
      resolve('1234');
    });
  }

  GetMockTrip = (fromId: string, toId: string) => {
    return new Promise((resolve, reject) => {
      this.GetMockAccessToken()
        .then(() => {
          let mock = mockData();
          resolve(mock);
        });
    });
  }
}

const mockData = () => {
  let mockLegsPretty: LegsRaw[] = [];
  mockTrip.Trip.forEach((trip: LegsRaw) => {
    if (!Array.isArray(trip.Leg)) {
      mockLegsPretty.push({ Leg: [trip.Leg] });
    } else {
      mockLegsPretty.push(trip);
    }
  });
  return mockLegsPretty;
};