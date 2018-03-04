var request = require('request');
var accessToken = '';
var attempts = 0;
var _ = require('lodash');

FetchAccessToken = () => {
  let options = {
    url: 'https://api.vasttrafik.se/token',
    method: 'POST',
    auth: {
      user: 'enRCZQWkxw0oVS5xDrcO6qZsAp0a',
      pass: 'H_tTcLe00_hn0STj1w4asDwixdMa'
    },
    form: {
      grant_type: 'client_credentials'
    }
  };
  return new Promise((resolve, reject)=>{
    request(options, function (err, res) {
      if (err) {
        reject(err);
      }
      let responseBody = res.body ? JSON.parse(res.body) : null;
      
      accessToken = responseBody.access_token;
       resolve(responseBody.access_token);
    }
    );
  })
}

UpdateStops = () => {
  const options = {
    url: 'https://api.vasttrafik.se/bin/rest.exe/v2/location.allstops?format=json',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      console.log(res.statusCode);
      if (attempts === 3) {
        attempts = 0;
        return reject('Cant get authorized...');
      }
      if (res.statusCode === 401) {
        console.log('Invalid');
        attempts++;
        FetchAccessToken()
          .then((mess) => {
            resolve(UpdateStops())
          });
        return null;
      }
      let responseBody = JSON.parse(res.body.toString());
      console.log(responseBody);     
      let stops = responseBody.LocationList.StopLocation;
      let filteredByTrack = _.filter(stops, (s) => !s.hasOwnProperty('track'));
      let sortedStops = _.sortBy(filteredByTrack, ['weight']).reverse();
      let cleanStops = _.map(sortedStops, (s) => {
        s.name = _.capitalize(s.name);
        return s;
      });
      resolve(cleanStops);
    })
  })
}

module.exports = {
  FetchAccessToken,
  UpdateStops
};