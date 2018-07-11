var request = require('request');
var _ = require('lodash');
var StopLocation = require('../db/mongoose/StopLocationModel');
var accessToken = '';
var attempts = 0;
var conf = require('../server-config/config');

// Grab token from Västtrafik
FetchAccessToken = () => {
  let options = {
    url: conf.tokenUrl,
    method: 'POST',
    auth: {
      user: conf.vastTrafikUser,
      pass: conf.vastTrafikSecret
    },
    form: {
      grant_type: 'client_credentials'
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (err, res) {
      err && reject(err);
      let responseBody = res.body ? JSON.parse(res.body) : null;
      accessToken = responseBody.access_token;
      resolve(responseBody.access_token);
    }
    );
  })
}

GetMatchingStops = (query) => {
  return StopLocation.find({ 'fullName': { '$regex': query, $options: 'i' } })
}

GetAllStopLocations = () => {
  return StopLocation.find({});
}
GetOneStopLocation = (id) => {
  return StopLocation.findOne({ id: id });
}
InsertStopLocations = (data) => {
  return StopLocation.insertMany(data);
}

// Performs a API-request to Västrafik, using accesstoken and searchparams
GetTripFromSearch = (fromId, toId) => {
  let tripBaseUrl = conf.tripBaseUrl;
  let url = tripBaseUrl + fromId + '&destId=' + toId + '&numTrips=10&format=json';
  let options = {
    url: url,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }

  return new Promise((resolve, reject) => {
    request(options,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        if (attempts === 3) {
          attempts = 0;
          return resolve('Problem getting valid token')
        }
        if (res.statusCode === 401) {
          attempts++;
          FetchAccessToken()
            .then((mess) => {
              resolve(GetTripFromSearch(fromId, toId))
            });
          return null;
        }
        attempts = 0;
        let responseBody = JSON.parse(res.body.toString());
        console.log(responseBody.TripList.Trip[0]);
        return resolve(responseBody);
      }
    );
  });
}

FetchStopLocations = () => {
  const options = {
    url: conf.allStopsUrl,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    }
  }
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) {
        return err;
      }
      if (attempts === 3) {
        attempts = 0;
        return reject('Cant get authorized...');
      }
      if (res.statusCode === 401) {
        console.log('401 Unauthorized. Trying to grab new token ' + attempts);
        attempts++;
        FetchAccessToken()
          .then((mess) => {
            resolve(FetchStopLocations())
          });
        return null;
      }
      console.log('200 - OK')
      let responseBody = JSON.parse(res.body.toString());
      let stops = responseBody.LocationList.StopLocation;
      let filteredByTrack = _.filter(stops, (s) => !s.hasOwnProperty('track'));
      let cleanStops = _.map(filteredByTrack, (s) => {
        let fullName = s.name.split(',')
        s.fullName = s.name;
        s.name = _.capitalize(_.trimEnd(fullName[0]));
        s.city = _.trimStart(fullName[1]);
        return s;
      });
      resolve(cleanStops);
    })
  })
}

module.exports = {
  FetchAccessToken,
  FetchStopLocations,
  GetAllStopLocations,
  InsertStopLocations,
  GetOneStopLocation,
  GetTripFromSearch,
  GetMatchingStops
};