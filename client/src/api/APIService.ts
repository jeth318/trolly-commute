import * as _ from 'lodash';
import { LegsRaw } from '../InterfaceCollection';
import { getDistance } from 'geolib';
import { locationBaseUrl, tokenUrl, vastTrafikSecret, vastTrafikUser, tripBaseUrl } from '../resources/rest.config';

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

      userPosition.latitute = position.coords.latitude;
      userPosition.longitude = position.coords.longitude;
  })
  .catch((err) => {
    console.error(err.message);
  });

export default class API {
  private accessToken = localStorage.getItem('access_token') || null;
  private tokenAttempt = 1;
  private retryLimit = 3;
  private authActions = { RETRY: 'retry', TERMINATE: 'terminate', PROCEED: 'proceed' }

  async getStopLocations(search: String) {
    const url = `${locationBaseUrl}${search}&format=json`
    const options = { headers: {'Authorization': `Bearer ${this.accessToken}`}};

    try {
      const response = await fetch(url, options);
      const { RETRY, TERMINATE } = this.authActions;

      if (this.checkTokenStatus(response) === RETRY) {
        await this.fetchAccessToken();
        this.tokenAttempt += 1;
        return await this.getStopLocations(search);
      } else if (this.checkTokenStatus(response) === TERMINATE){
          throw new Error(`Could not get a valid access token. Terminated after ${this.retryLimit} attempts`)
      }
      const data = await response.json();
      const rawStopLocations = _.take(this.sortByIdx(data.LocationList.StopLocation), 15);
      return { stopLocations: this.formatStopLocations(rawStopLocations) };
    } catch (err) {
        return console.error(err)
    }
  }

  async getTrips(fromId: string, toId: string) {
    const url = tripBaseUrl + fromId + '&destId=' + toId + '&numTrips=10&format=json';
    let options = { headers: { Authorization: 'Bearer ' + this.accessToken }}
    const { RETRY, TERMINATE } = this.authActions;
    
    try {
      const response = await fetch(url, options);
      if (this.checkTokenStatus(response) === RETRY) {
        await this.fetchAccessToken();
        this.tokenAttempt += 1;
        return this.getTrips(fromId, toId);
      } else if (this.checkTokenStatus(response) === TERMINATE) {
          throw new Error(`Could not get a valid access token. Terminated after ${this.retryLimit} attempts`)
      }
      const data = await response.json();
      const tripData: LegsRaw[] = data.TripList.Trip.map((trip: LegsRaw) => Array.isArray(trip.Leg) ? trip : { Leg: [trip.Leg] });
      return tripData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchAccessToken(){
    const params = {
      'client_id': vastTrafikUser,
      'client_secret': vastTrafikSecret,
      'grant_type': 'client_credentials'
    };
    const headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    const body = Object.keys(params).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');

    const options = { method: 'POST', headers, body };
    const response = await fetch(tokenUrl, options);
    const data = await response.json();
    this.accessToken = data.access_token;
    localStorage.setItem('access_token', data.access_token);
  }

  private checkTokenStatus(response) {
    const { RETRY, TERMINATE, PROCEED } = this.authActions;
    if(response.status === 401) {
      return this.tokenAttempt < this.retryLimit ? RETRY : TERMINATE;
    } else {
      return PROCEED;
    }
  }

  private formatStopLocations(data) {
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
        stopLocation.price =  distance + ' m' + ' 📍'
      } else {
        stopLocation.price = Math.round(distance/1000 * 10 ) / 10  + ' km' + ' 📍';
      }
      return stopLocation;
    });
  };

  private sortByIdx(stopLocations: any) {
    return _.sortBy(stopLocations, ['idx']);
  }
}