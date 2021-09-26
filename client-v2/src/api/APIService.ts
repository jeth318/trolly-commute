import axios, { AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';
import { LegsRaw, StopLocation } from '../InterfaceCollection';
import { getDistance } from 'geolib';
import { stopLocationsUrl, tripsUrl } from './rest.config';

let userPosition = {
  latitute: 0,
  longitude: 0
};

const updateUserPosition: PositionCallback = (position: Position) => {
  userPosition.latitute = position.coords.latitude;
  userPosition.longitude = position.coords.longitude;
};

navigator.geolocation.getCurrentPosition(updateUserPosition);

export default class API {
  async getStopLocations(query: String) {
    const config: AxiosRequestConfig = {
      url: stopLocationsUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { query }
    }

    try {
      const response = await axios(config);
      const data = await response.data;
      const rawStopLocations = _.take(this.sortByIdx(data.LocationList.StopLocation), 15);
      return { stopLocations: this.formatStopLocations(rawStopLocations) };
    } catch (err) {
        return console.error(err);
    }
  }

  async getTrips(fromId: string, toId: string) {
    console.log(tripsUrl);
    
    const config: AxiosRequestConfig = {
      url: tripsUrl,
      method: 'post',
      data: { toId, fromId },
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios(config);
      const data: LegsRaw[] = await response.data;
      return data;
    } catch (error) { 
      console.log('ERROR', error);
      
      return console.error(error)
  }
}

  private formatStopLocations(data: StopLocation[]) {
    return _.map(data, (stopLocation: any) => {
      const splittedName = stopLocation.name.split(',');
      stopLocation.key = stopLocation.id;
      stopLocation.title = splittedName[0].trim();
      stopLocation.description = splittedName[1] ? splittedName[1].trim() : splittedName[0].trim();

      const distance = getDistance(
        { latitude: stopLocation.lat, longitude: stopLocation.lon },
        { latitude: userPosition.latitute, longitude: userPosition.longitude }
      );

      if (distance < 300) {
        stopLocation.price = distance + ' m' + ' 📍';
      } else {
        stopLocation.price = Math.round(distance / 1000 * 10) / 10 + ' km' + ' 📍';
      }
      return stopLocation;
    });
  }

  private sortByIdx(stopLocations: any) {
    return _.sortBy(stopLocations, ['idx']);
  }
}