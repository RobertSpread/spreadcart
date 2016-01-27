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

    if (!req.body.action)
        return next(new Error("missing action"));

    switch(req.body.action) {
        case "read":
            proxyReadBasket(req.body, res, next);
            break;
        case "delete":
            proxyDeleteFromBasket(req.body, res, next);
            break;
        default:
            next(new Error("unknown action"));
    }
});

//// PROXY SERVICES ////

function proxyReadBasket(params, res, next) {

    try {
        validateBasketID(params);
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        throw err;
    }

    readBasket(params.platformTLD, params.basketId, res, next);
}

function proxyDeleteFromBasket(params, res, next) {

    try {
        validateBasketID(params);
        validateBasketItemID(params);
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        throw err;
    }

    deleteFromBasket(params.platformTLD, params.basketId, params.basketItemId,
        res, next);
}

//// API SERVICES ////

function readBasket(tld, basketID, res, next) {

    httpGet("read basket", getBasketURL(tld, basketID), res, next);
}

function deleteFromBasket(tld, basketID, itemID, res, next) {

    var url = getBasketURL(tld, basketID) +"/items/"+ itemID;
    httpDelete("item deletion", url, res, next);
}

//// HTTP SUPPORT ////

function httpGet(actionName, url, clientRes, next) {

    request.get(url, {
            "Authorization": getAuthHeader("GET", url),
            "Content-Type": API_CONTENT_TYPE
        },
        function(err, apiRes, body) {
            if (err) return next(failureResponse(actionName, err, apiRes));
            successResponse(actionName, clientRes, {xml: body});
        });
}

function httpDelete(actionName, url, clientRes, next) {

    request.del(url, {
            "Authorization": getAuthHeader("DELETE", url),
            "Content-Type": API_CONTENT_TYPE
        },
        function(err, apiRes) {
            if (err) return next(failureResponse(actionName, err, apiRes));
            successResponse(actionName, clientRes, {});
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

function getBasketURL(tld, basketID) {
    return "http://api.spreadshirt."+ tld +"/api/v1/baskets/"+ basketID;
}

function successResponse(action, res, data) {
    //console.log(action +" succeeded");
    res.send(data);
}

function failureResponse(action, err, res) {
    return new Error(action +" failed - status: "+ err.status +
    ", message: "+ err.message);
}

//// VALIDATION SUPPORT ////

function validateBasketID(params) {
    // console.log(JSON.stringify(params));
    if (!isValidParam(params.platformTLD, 3) ||
        !isValidParam(params.basketId, 100)) {
        throw new Error("invalid basket");
    }
}

function validateBasketItemID(params) {
    if (!isValidParam(params.basketItemId, 100)) {
        throw new Error("invalid basket item");
    }
}

function isValidParam(str, maxLen) {
    return (typeof str == "string" &&
    /^[-a-z0-9]*$/i.test(str) && str.length <= maxLen);
}

module.exports = router;