'use strict';

//// DEPENDENT MODULES ////

var express = require('express');
var crypto = require('crypto');
var request = require('request');

//// CONFIGURATION ////

var API_CONTENT_TYPE = "application/xml";

//// SUBROUTES ////

var router = express.Router();
router.post('/', function(req, res, next) {

    if (!req.body.operation)
        return next(new Error("missing operation"));

    if (req.body.operation == "delete")
        deleteFromCart(req.body, res, next);
    else
        next(new Error("unknown operation"));
});

//// SERVICES ////

function deleteFromCart(params, res, next) {

    var tld = params.platformTLD;
    var basketID = params.basketId;
    var itemID = params.basketItemId;
    
    if (!isValidParam(tld, 3) || !isValidParam(basketID, 100) ||
            !isValidParam(itemID, 100)) {
        return next(new Error("invalid parameter"));
    }
    
    var url = "http://api.spreadshirt."+ tld +"/api/v1/baskets/"+
                basketID +"/items/"+ itemID;
    httpDelete(url, res, next);
}

//// SUPPORT FUNCTIONS ////

function httpDelete(url, clientRes, next) {
    var action = "item deletion";
    
    request.del(url, {
        "Authorization": getAuthHeader("DELETE", url),
        "Content-Type": API_CONTENT_TYPE
    },
    function(err, apiRes) {
        if (err) return next(failureResponse(action, err, apiRes));
        successResponse(action, clientRes, {});
    });
}

function getAuthHeader(method, url) {
    var apiKey = "";
    var secret = "";
    var time = new Date().getTime();
    var apiData = method +" "+ url +" "+ time;
    var hashData = apiData +" "+ secret;
    var sig = crypto.createHash('sha1').update(hashData).digest('hex');
    
    return 'AprdAuth apiKey="'+ apiKey +'", data="'+ apiData +
                '", sig="'+ sig +'"';
}

function isValidParam(str, maxLen) {
    return (typeof str == "string" &&
                /^[-a-z0-9]*$/i.test(str) && str.length <= maxLen);
}

function successResponse(action, res, data) {
    //console.log(action +" succeeded");
    res.send(data);
}

function failureResponse(action, err, res) {
    return new Error(action +" failed - status: "+ err.status +
                    ", message: "+ err.message);
}

module.exports = router;