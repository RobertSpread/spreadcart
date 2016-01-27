'use strict';

//// DEPENDENT MODULES ////

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//// MODULE VARIABLES ////

var isOffline = false;

//// HTTP PROTOCOL STACK ////

var app = express();
app.use(function(req, res, next) {
    if(isOffline)
        res.sendFile(__dirname +'/public/offline.html');
    else
        next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//// REST API ROUTES ////

app.use('/cart', require('./cart'));

//// ERROR HANDLING ////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {

    console.error('%sutc error: %s [%s] %j',
        getUTCTimeString(), req.originalUrl, err.message, err);
    res.status(err.status || 500);

    if (req.xhr)
        res.send({ message: err.message });
    else {
        var message = "Error "+ err.status +": "+ err.message;
        res.send("<h1><center>"+ message +"</center></h1");
    }
});

//// UTILITY METHODS ////

function getUTCTimeString() {
    return new Date().toISOString().replace('T', ' ').substr(0, 19);
}

//// LAUNCH SERVER ////

var port = 3000; // default to conventional port
if (process.argv.length >= 3) {
    if (!/^[0-9]+$/.test(process.argv[2])) {
        console.log("invalid port number")
        exit();
    }
    port = parseInt(process.argv[2]);
}
if (process.argv.length >= 4) {
    if (process.argv[3] === '-offline')
        isOffline = true;
}

var server = app.listen(port, function() {
    console.log(getUTCTimeString() +'utc - Listening on port '+
    server.address().port);
});
