let tokenRetryAttempt = 0;
const retryLimit = 3;
let timeoutActive = false;
const authActions = { RETRY: 'retry', TERMINATE: 'terminate', TIMEOUT: 'timeout', PROCEED: 'proceed' };
const { RETRY, TERMINATE, PROCEED, TIMEOUT } = authActions;
const { tokenConfig } = require('./rest.config');
const axios = require('axios');

const errorHandler = async ({ req, res, error, route }) => {
	if (checkTokenStatus(error) === RETRY) {
		delete axios.defaults.headers.common['Authorization'];
		await fetchAccessToken();
		tokenRetryAttempt += 1;
		console.error(`Could not get a valid access token. Trying again. (attempt ${tokenRetryAttempt})`);
		// Retry
		return route(req, res);
	} else if (checkTokenStatus(error) === TERMINATE) {
		const errorMessage = `Retry limit hit\nTerminated after ${retryLimit} attempts. Banning retries for 60 seconds.`;
		console.error(errorMessage);
		startTimeout();
		return res.status(500).json({ error: errorMessage })
	} else if (checkTokenStatus(error) === TIMEOUT) {
		const errorMessage = 'Fetch requests is on timeout. Wait a minute and try again' 
		console.error(errorMessage);
		return res.status(500).json({ error: errorMessage })
	}else {
		console.log(error);
		return res.status(500).send(error);
	}
};

const fetchAccessToken = async () => {
	try {
		const response = await axios(tokenConfig);
		const accessToken = response.data.access_token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		return console.log(`New token fetched: ${accessToken}`);
	} catch (error) {
		return console.error('Could not fetch token:', error.message);
	}
};

const checkTokenStatus = error => {
	if (error.response && error.response.status === 401) {
		return tokenRetryAttempt < retryLimit
			? RETRY : timeoutActive
				? TIMEOUT : TERMINATE;
	} else {
		return PROCEED;
	}
};

const startTimeout = () => {
	timeoutActive = true;
	setTimeout(() => {
		timeoutActive = false;
		tokenRetryAttempt = 0;
		console.log('Timeout was reset.');
	}, 60000);
}

module.exports = { errorHandler, fetchAccessToken, checkTokenStatus };