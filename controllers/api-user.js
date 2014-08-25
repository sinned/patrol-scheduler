/*
 * api-user.js
 * User API 
 *
 */

var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');

/*
 * sendResponse
 * unifies the response of the API
 *
 */

var sendResponse = function (req, res, data, errors, destination, success_messages) {
  console.log('Sending Response');
  if (req.body.jsonp == 'jsonp') {
    if (errors) {
      res.send(errors);
    } else {
      res.send(data);
    }    
  } else {
    if (errors) {
      req.flash('errors', errors );
      res.redirect(destination);
    } else {
      req.flash('success', success_messages );      
      res.redirect(destination);
    }
  }

}

exports.getUser = function (req, res) {
  var user = {
    name : 'foo',
    email : 'foo@foo.com'
  };
  res.send(user);
}


exports.postUser = function(req, res, next) {

  req.assert('email', 'Email is not valid.').isEmail();
  var errors = req.validationErrors();

  // generate a password if one is not provided.
  var password = req.body.password ? req.body.password : Math.random();

  if (!errors) {
    var user = new User({
      email: req.body.email,
      password: password,
      profile: {
        name: req.body.name
      }
    });
    console.log('creating user ', user);
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        errors = { msg: 'Account with that email address already exists.' };
      } else {
        user.save(function(err) {
          if (err) {
            errors = { msg: 'Database error occured.' };
          }
        });        
      }
      sendResponse(req, res, user, errors, '/directory', {msg: 'User <b>' +req.body.name+ '</b> created.'});
    });
  } else {
    sendResponse(req, res, null, errors, '/directory', {msg: 'User <b>' +req.body.name+ '</b> created.'});
  }


};