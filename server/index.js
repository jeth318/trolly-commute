const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const cors = require('cors');

const { tokenConfig } = require('./resources/rest.config');

// Middleware
app.use(cors());
app.set('port', port);
app.listen(app.get('port'), () => console.log('Running @ ' + app.get('port')));

// Main route
app.get('/', function (req, res) {
	res.sendStatus(200);
});

const tokenHandler = async(req, res, next) => {
	try {
		const response = await axios(tokenConfig);
		const data = response.data;
		res.json(data);
	} catch (error) {
		res.send(error);
	}
}

app.get('/api/token', tokenHandler);
