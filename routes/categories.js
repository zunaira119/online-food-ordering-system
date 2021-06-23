const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');


const Category = require('../models/category');

const categoriesRouter = express.Router();

categoriesRouter.use(bodyParser.json());

categoriesRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) => {
    Category.find(req.query)
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Category.create(req.body)
    .then((category) => {
        console.log('Category Created ', category);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /categories');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Category.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

categoriesRouter.route('/:categoryId')
.get( authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Category.findById(req.params.categoryId)
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /categories/'+ req.params.categoryId);
})
.put( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Category.findByIdAndUpdate(req.params.categoryId, {
        $set: req.body
    }, { new: true })
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Category.findByIdAndRemove(req.params.categoryId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = categoriesRouter;