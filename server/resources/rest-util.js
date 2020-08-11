let tokenRetryAttempt = 0;
const retryLimit = 3;
const authActions = { RETRY: 'retry', TERMINATE: 'terminate', PROCEED: 'proceed' };
const { RETRY, TERMINATE, PROCEED } = authActions;
const { tokenConfig } = require('./rest.config');
const axios = require('axios');

const errorHandler = async ({ req, res, error, route }) => {
	if (checkTokenStatus(error) === RETRY) {
		tokenRetryAttempt += 1;
		console.error(`Could not get a valid access token. Trying again. (attempt ${tokenRetryAttempt})`);
		await fetchAccessToken();
		// Retry
		return route(req, res);
	} else if (checkTokenStatus(error) === TERMINATE) {
		tokenRetryAttempt = 0;
		delete axios.defaults.headers.common['Authorization'];
		const errorMessage = `Retry limit hit\nTerminated after ${retryLimit} attempts. Banning retries for 60 seconds.`;
		console.error(errorMessage);
		return res.status(500).json({ error: errorMessage })
	} else {
		tokenRetryAttempt = 0;
		return res.status(500).send(error);
	}
};

const fetchAccessToken = async () => {
	try {
		const response = await axios(tokenConfig);
		const accessToken = response.data.access_token;
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		tokenRetryAttempt = 0;
		return console.log(`New token fetched: ${accessToken}`);
	} catch (error) {
		return console.error('Could not fetch token:', error.message);
	}
};

const checkTokenStatus = error => {
	if (error.response && error.response.status === 401) {
		return tokenRetryAttempt < retryLimit
			? RETRY : TERMINATE
	} else {
		return PROCEED;
	}
};

module.exports = { errorHandler, fetchAccessToken, checkTokenStatus };
