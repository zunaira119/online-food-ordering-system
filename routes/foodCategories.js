const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');


const FoodCategory = require('../models/foodCategory');

const foodCategoriesRouter = express.Router();

foodCategoriesRouter.use(bodyParser.json());

foodCategoriesRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) => {
    FoodCategory.find(req.query)
    .then((foodCategory) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(foodCategory);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    FoodCategory.create(req.body)
    .then((foodCategory) => {
        console.log('Category Created ', foodCategory);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(foodCategory);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /categories');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    FoodCategory.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

foodCategoriesRouter.route('/:foodCategoryId')
.get( authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    FoodCategory.findById(req.params.foodCategoryId)
    .then((foodCategory) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(foodCategory);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /categories/'+ req.params.foodCategoryId);
})
.put( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    FoodCategory.findByIdAndUpdate(req.params.foodCategoryId, {
        $set: req.body
    }, { new: true })
    .then((foodCategory) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(foodCategory);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    FoodCategory.findByIdAndRemove(req.params.foodCategoryId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = foodCategoriesRouter;