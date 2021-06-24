const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');


const Menues = require('../models/Menu');
const menu = require('../models/Menu');

const MenuRouter = express.Router();

MenuRouter.use(bodyParser.json());

MenuRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) => {
    Menues.find(req.query)
    .populate('foodCategory')
    .then((menu) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(menu);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser, authenticate.verifyAdmin ,(req, res, next) => {
    if (req.body != null) {
        // req.body.author = req.user._id;
        Menues.create(req.body)
        .then((menu) => {
            Menues.findById(menu._id)
            .populate('foodCategory')
            .then((menu) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(menu);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('menu not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put( authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments/');
})
.delete( authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Menues.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

MenuRouter.route('/:menuId')
.options(authenticate.verifyAdmin,authenticate.verifyAdmin, (req, res) => { res.sendStatus(200); })
.get( (req,res,next) => {
    Menues.findById(req.params.menuId)
    .populate('foodCategory')
    .then((menu) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(menu);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /comments/'+ req.params.commentId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin ,(req, res, next) => {
    Menues.findById(req.params.menuId)
    .then((menu) => {
        if (menu != null) {
            Menues.findByIdAndUpdate(req.params.menuId, {
                $set: req.body
            }, { new: true })
            .then((menu) => {
                Menues.findById(menu._id)
                .populate('foodCategory')
                .then((menu) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(menu); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Menu ' + req.params.menuId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Menues.findById(req.params.menuId)
    .then((menu) => {
        if (menu != null) {
            Menues.findByIdAndRemove(req.params.menuId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Menu ' + req.params.menuId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = MenuRouter;