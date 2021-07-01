const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Order = require('../models/order');
const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

orderRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    Order.find(req.query)
    .populate(['user','products'])
    .then((order) => {
        console.log(order.products)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Order.create(req.body)
    .then((order) => {
        console.log(req.body);
        Order.findById(order._id)
        .populate(['user','product'])
        .then((order) => {
        
            req.totalAmount = order.product.price * order.quantity;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order);
        });
    }, (err) => next(err))
    .catch((err) => next(err));
});
orderRouter.route('/updateStatus/:orderId')
.post(authenticate.verifyUser,(req,res,next) => {
    Order.findById(req.params.orderId)
    .then((order) => {
        if (order != null) {
            console.log(req.user.admin);
            if (order.user._id.equals(req.user._id) || (req.user.admin == true)) {
            Order.findByIdAndUpdate(req.params.orderId, {
                 "$set" : { "status" : req.body.status } 
            }, { new: true })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            var err = new Error('You are not authorized to update this record!');
            err.status = 403;
            return next(err);
        }
    }
        else {
            err = new Error('order ' + req.params.orderId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});
// .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /categories');
// })
// .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
//     FoodCategory.remove({})
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err));    
// });

// foodCategoriesRouter.route('/:foodCategoryId')
// .get( authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
//     FoodCategory.findById(req.params.foodCategoryId)
//     .then((foodCategory) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(foodCategory);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /categories/'+ req.params.foodCategoryId);
// })
// .put( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
//     FoodCategory.findByIdAndUpdate(req.params.foodCategoryId, {
//         $set: req.body
//     }, { new: true }) 
//     .then((foodCategory) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(foodCategory);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
//     FoodCategory.findByIdAndRemove(req.params.foodCategoryId)
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

module.exports = orderRouter;