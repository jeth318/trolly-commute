var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
const port = process.env.PORT || '5000';

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', port);
app.use(express.static(__dirname + '/client/build'));

app.listen(app.get('port'), () => console.log('Running @ ' + app.get('port')));

// Main route
app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html')
	.sendFile(path.join(__dirname, '/client/build/index.html'))
});

setInterval(function() {
	https.get("https://trolly-commute.herokuapp.com/");
}, 300000); // every 5 minutes (300000)