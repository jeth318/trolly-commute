import axios from 'axios';
import * as _ from 'lodash';
import { LegsRaw, StopLocation } from '../InterfaceCollection';
import { getDistance } from 'geolib';
import { locationBaseUrl, tokenUrl, tripBaseUrl } from '../resources/rest.config';

const getPosition = (options?) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

let userPosition = {
  latitute: 0,
  longitude: 0
};

const updateUserPosition: PositionCallback = (position: Position) => {
  userPosition.latitute = position.coords.latitude;
  userPosition.longitude = position.coords.longitude;
}

navigator.geolocation.getCurrentPosition(updateUserPosition);

export default class API {
  private accessToken = localStorage.getItem('access_token') || null;
  private tokenAttempt = 1;
  private retryLimit = 3;
  private authActions = { RETRY: 'retry', TERMINATE: 'terminate', PROCEED: 'proceed' };

  async getStopLocations(search: String) {
    const url = `${locationBaseUrl}${search}&format=json`;
    const options = { headers: {'Authorization': `Bearer ${this.accessToken}`}};
    try {
      const response = await axios(url, options);
      const data = await response.data;
      const rawStopLocations = _.take(this.sortByIdx(data.LocationList.StopLocation), 15);
      return { stopLocations: this.formatStopLocations(rawStopLocations) };
    } catch (err) {
      const { RETRY, TERMINATE } = this.authActions;
      if (this.checkTokenStatus(err) === RETRY) {
        await this.fetchAccessToken();
        this.tokenAttempt += 1;
        return await this.getStopLocations(search);
      } else if (this.checkTokenStatus(err) === TERMINATE) {
          throw new Error(`Could not get a valid access token. Terminated after ${this.retryLimit} attempts`);
      }
      return console.error('UNEXPECTED ERROR: ', err);
    }
  }

  async getTrips(fromId: string, toId: string) {
    const url = tripBaseUrl + fromId + '&destId=' + toId + '&numTrips=10&format=json';
    let options = { headers: { Authorization: 'Bearer ' + this.accessToken }};
    const { RETRY, TERMINATE } = this.authActions;
    
    try {
      const response = await axios(url, options);      
      const data = await response.data;
      const tripData: LegsRaw[] = data.TripList.Trip
        .map((trip: LegsRaw) => Array.isArray(trip.Leg) ? trip : { Leg: [trip.Leg] });
      return tripData;
    } catch (error) {
      console.log('ERROR!!!', error);
      
      if (this.checkTokenStatus(error) === RETRY) {
        await this.fetchAccessToken();
        this.tokenAttempt += 1;
        return this.getTrips(fromId, toId);
      }
      throw new Error(error.message);
    }
  }

  async fetchAccessToken() {
    try {
      const response = await axios(tokenUrl);
      const data = await response.data;
      this.accessToken = data.access_token;
      console.log('Acesstoken: ', this.accessToken);
      localStorage.setItem('access_token', data.access_token);
    } catch (error) {
      console.log('ERROR WHILE FETCHING TOKEN', error)
    }
    
  }

  private checkTokenStatus(error: any) {
    console.log(error);
    
    const { RETRY, TERMINATE, PROCEED } = this.authActions;
    console.log('ERROR.RESPONSE!', error.response);
    
    if(error.response && error.response.status === 401) {
      return this.tokenAttempt < this.retryLimit ? RETRY : TERMINATE;
    } else {
      return PROCEED;
    }
  }

  private formatStopLocations(data: StopLocation[]) {
    return _.map(data, (stopLocation: any) => {
      const splittedName = stopLocation.name.split(',');
      stopLocation.key = stopLocation.id;
      stopLocation.title = splittedName[0].trim();
      stopLocation.description = splittedName[1] ? splittedName[1].trim() : splittedName[0].trim();
      
      const distance = getDistance(
        { latitude: stopLocation.lat, longitude: stopLocation.lon},
        { latitude: userPosition.latitute, longitude: userPosition.longitude }
      );

      if (distance < 300) {
        stopLocation.price =  distance + ' m' + ' 📍';
      } else {
        stopLocation.price = Math.round(distance/1000 * 10 ) / 10  + ' km' + ' 📍';
      }
      return stopLocation;
    });
  }

  private sortByIdx(stopLocations: any) {
    return _.sortBy(stopLocations, ['idx']);
  }
}