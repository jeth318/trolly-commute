var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var StopLocation = require('./db/mongoose/StopLocationModel');
var api = require('./services/api');

var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@ds141068.mlab.com:41068/trollycommute')
.then(()=>console.log('Esablished connection to mLab...'))
.catch((err)=>res.send(err))

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>console.log('Connected to mongoose'));

const port = process.env.PORT || '5000';

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', port);
app.use(express.static(__dirname + '/client/build'));

app.listen(app.get('port'), function(){
	console.log('Running @ ' + app.get('port'))
});

// Main route
app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html')
	.sendFile(path.join(__dirname, '/public/index.html'))
});



// Fetches stored stoplocations from mongodb
app.post('/api/stops', function(req, res){
	api.GetMatchingStops(req.body.search)
	.then((data)=>{
		res.json({searchResponse: data});
	})
	.catch((err)=>res.json(err));
})

// Fetches trip data from remote
app.post('/api/trips', function(req, res){
	api.GetTripFromSearch(req.body.origin, req.body.destination)
	.then((data)=>{
		res.json(data)
	})
	.catch((err)=>res.send(err))
})

// Updates the stored stoplocations with new ones from vasttrafik
app.get('/api/stoplocations', function(req, res) {
	api.GetAllStopLocations()
	.then((result)=>{
		return res.json(result);
	})
	.catch((err)=>{
		console.log(err);
		res.send({error: err})
	})
})

app.get('/api/update/stoplocations', function(req, res){
	StopLocation.remove()
	.then(()=>{
		return api.FetchStopLocations();
	})
	.then((res)=>{
		return api.InsertStopLocations(res);
	})
	.then(()=>{
		console.log('Done')
		res.json({data: 'Success'});
	})
	.catch((err)=>{
		res.send({error: 'Failed inserting', stack: err})
	})
})