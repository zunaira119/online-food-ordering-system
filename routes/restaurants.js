const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');


const Restaurant = require('../models/restaurant');


const RestaurantsRouter = express.Router();

RestaurantsRouter.use(bodyParser.json());

RestaurantsRouter.route('/')
.get( (req,res,next) => {
    Restaurant.find(req.query)
    .populate([{path:'owner', select:'username'}, {path:'category', select:'name'},{path:'menues',select:'name'}])
    .then((restaurant) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(restaurant);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser, authenticate.verifyAdmin ,(req, res, next) => {
    if (req.body != null) {
        // req.body.author = req.user._id;
        Restaurant.create(req.body)
        .then((restaurant) => {
            Restaurant.findById(restaurant._id)
            .populate([{path:'owner', select:'username'}, {path:'category', select:'name'},{path:'menues',select:'name'}])
            .then((restaurant) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(restaurant);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('restaurant not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put( authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /restaurants/');
})
.delete( authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Restaurant.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

RestaurantsRouter.route('/:restaurantId')
.options(authenticate.verifyAdmin,authenticate.verifyAdmin, (req, res) => { res.sendStatus(200); })
.get( (req,res,next) => {
    Restaurant.findById(req.params.restaurantId)
    .populate([{path:'owner', select:'username'}, {path:'category', select:'name'},{path:'menues',select:'name'}])
    .then((restaurant) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(restaurant);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /retaurants/'+ req.params.restaurantId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin ,(req, res, next) => {
    Restaurant.findById(req.params.restaurantId)
    .then((restaurant) => {
        if (restaurant != null) {
            Restaurant.findByIdAndUpdate(req.params.restaurantId, {
                $set: req.body
            }, { new: true })
            .then((restaurant) => {
                Restaurant.findById(restaurant._id)
                .populate([{path:'owner', select:'username'}, {path:'category', select:'name'},{path:'menues',select:'name'}])
                .then((restaurant) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(restaurant); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Restaurant ' + req.params.restaurantId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Restaurant.findById(req.params.restaurantId)
    .then((restaurant) => {
        if (restaurant != null) {
            Restaurant.findByIdAndRemove(req.params.restaurantId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Menu ' + req.params.restaurantId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = RestaurantsRouter;