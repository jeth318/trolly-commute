const mongoose = require('mongoose');
const StopLocationSchema = mongoose.Schema({
    id: String,
    name: String,
    lat: Number,
    lon: Number,
    weight: Number
});

module.exports = mongoose.model('StopLocation', StopLocationSchema, 'stop-locations');