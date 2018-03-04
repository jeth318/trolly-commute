var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var StopLocation = require('./db/mongoose/StopLocationModel');
var API = require('./services/API');

//API.FetchAccessToken().then((res)=>console.log(res));
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@ds141068.mlab.com:41068/trollycommute');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>console.log('Connected to mongoose'));

const port = process.env.PORT || '5000';

app.use(bodyParser.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('port', port);
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html')
	.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(app.get('port'), function(){
	console.log('Running @ ' + app.get('port'))
});

app.get('/api/update/stoplocations', function(req, res){
	StopLocation.remove()
	.then(()=>{
		return API.UpdateStops();
	})
	.then((res)=>{
		return API.UpdateStops()
	})
	.then((res)=>{
		return StopLocation.insertMany(res);
	})
	.then(()=>{
		res.json({msg: 'Success'});
	})
	.catch((err)=>{
		res.send({error: 'Failed inserting', stack: err})
	})
})

app.get('/api/stoplocations', function(req, res){
	console.log('Got a request')
	console.log(req.body);
	StopLocation.find()
	.then(()=>{
		res.json({data: req.body});
	})
	.catch((err)=>{
		res.send({error: 'Failed getting stoplocations', stack: err})
	})
})