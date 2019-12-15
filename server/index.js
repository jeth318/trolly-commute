const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const { locationBaseUrl, tokenConfig, tripBaseUrl } = require('./resources/rest.config');

let accessToken = '';
let tokenAttempt = 1;
const retryLimit = 3;
const authActions = { RETRY: 'retry', TERMINATE: 'terminate', PROCEED: 'proceed' };
const { RETRY, TERMINATE, PROCEED } = authActions;
// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', port);
app.listen(app.get('port'), () => console.log('Running @ ' + app.get('port')));

// Main route
app.get('/', function (req, res) {
	res.sendStatus(200);
});

const fetchAccessToken = async () => {
	try {
		const response = await axios(tokenConfig);
		const data = response.data;
		accessToken = data.access_token;
		return console.log(`New token fetched: ${accessToken}`);
	} catch (error) {
		return console.error(error);
	}
}

const checkTokenStatus = error => {
	if (error.response && error.response.status === 401) {
		return tokenAttempt < retryLimit ? RETRY : TERMINATE;
	} else {
		return PROCEED;
	}
}

const errorHandler = async (req, res, error) => {
	if (checkTokenStatus(error) === RETRY) {
		await fetchAccessToken();
		tokenAttempt += 1;
		return tripsRoute(req, res);
	} else if (checkTokenStatus(error) === TERMINATE) {
		const errorMessage = `Could not get a valid access token. Terminated after ${retryLimit} attempts. Banning retries for 60 seconds.`;
		console.error(errorMessage);
		setTimeout(()=> {
			tokenAttempt = 0;
		}, 60000);
		return res.status(500).json({ error: errorMessage })
	} else {
		console.log(error);
		return res.status(500).send(error);
	}
} 

const stopLocationsRoute = async (req, res) => {
	const { query } = req.body;
	const url = `${locationBaseUrl}${query}&format=json`;
	const options = { headers: { 'Authorization': `Bearer ${accessToken}` } };

	try {
		const response = await axios(url, options);
		const data = response.data;
		if (data.StopLocation && data.StopLocation.error) {
			return errorHandler(req, res, data.StopLocation);
		}
		return res.json(response.data);
	} catch (error) {
		return errorHandler(req, res, error);
	}
}

const tripsRoute = async (req, res) => {
	const { fromId, toId } = req.body;
	const url = `${tripBaseUrl}${fromId}&destId=${toId}&numTrips=10&format=json`;
	let options = { headers: { Authorization: `Bearer ${accessToken}` } };

	try {
		const response = await axios(url, options);
		const data = await response.data;
		if (data.TripList && data.TripList.error) {
			return errorHandler(req, res, data.TripList);
		}
		const tripData = data.TripList.Trip
			.map(trip => Array.isArray(trip.Leg) ? trip : { Leg: [trip.Leg] });
		return res.status(200).json(tripData);
	} catch (error) {
		return errorHandler(req, res, error);
	}
}

app.post('/api/trips', tripsRoute);
app.post('/api/stop-locations', stopLocationsRoute);
