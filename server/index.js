const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getTripsConfig, getStoplocationConfig } = require('./resources/rest.config.js');
const { errorHandler } = require('./resources/rest-util.js');

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', port);
app.listen(app.get('port'), () => console.log('Running @ ' + app.get('port')));

// Main route
app.get('/', function (req, res) {
	console.log(req.headers);
	console.log(req.path);	
res.sendStatus(200);
});

const stopLocationsRoute = async (req, res) => {
	const { query } = req.body;
	const encodedQuery = encodeURI(query);
	try {
		const response = await axios(getStoplocationConfig(encodedQuery));
		const data = response.data;
		if (data.StopLocation && data.StopLocation.error) {
			const { error } = data.StopLocation;
			const args = { req, res, error, route: stopLocationsRoute }
			return errorHandler(args);
		}
		return res.json(data);
	} catch (error) {
		const args = { req, res, error, route: stopLocationsRoute };
		return errorHandler(args);
	}
};

const tripsRoute = async (req, res) => {
	const { fromId, toId } = req.body;
	try {
		const response = await axios(getTripsConfig(fromId, toId));
		const data = await response.data;
		if (data.TripList && data.TripList.error) {
			const { error } = data.TripList;
			const args = { req, res, error, route: tripsRoute}
			return errorHandler(args);
		}
		const tripData = data.TripList.Trip
			.map(trip => Array.isArray(trip.Leg) ? trip : { Leg: [trip.Leg] });
		return res.status(200).json(tripData);
	} catch (error) {
		const args = { req, res, error, route: tripsRoute };
		return errorHandler(args);
	}
};

app.post('/trips', tripsRoute);
app.post('/stop-locations', stopLocationsRoute);
