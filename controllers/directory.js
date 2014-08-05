var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');

/**
 * GET /directory
 * Directory page.
 */

exports.getDirectory = function(req, res) {
  var query = User.find( { } ); // find all users
  query.sort('profile.name');
  query.exec(function (err, users) {
    if (err) {
      console.warn("Error in getDirectory(), finding users", err);
      return;
    }
    console.log(users);
    res.render('directory', {
      title: 'Directory', 
      users: users
    });
  });
};
