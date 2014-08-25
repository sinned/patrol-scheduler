var async = require('async');
var Schedule = require('../models/Schedule');
var User = require('../models/User');

/**
 * GET /
 * Home page.
 */

exports.getSchedule = function(req, res) {

  if(req.user) {
    // async call to get both the schedules AND the users
    async.parallel({
      schedules: function (callback) {
          var query = Schedule.find( { deleted: false } ); 
          query.sort('date');
          query.exec(function (err, schedules) {
            if (err) {
              console.warn("Error in getSchedule(), finding schedules", err);
              return;
            }
            callback(null, schedules);
          });      
      },
      users: function (callback) {
        var query = User.find( { } ); // find all users
        query.sort('profile.name');
        query.exec(function (err, users) {
            if (err) {
              console.warn("Error in getting all users", err);
              return;
            }      
          callback(null, users);
        });
      }}, function (err, results) {

        //console.log(req.user);

        res.render('schedule', {
          title: 'Schedule', 
          schedules: results.schedules,
          users: results.users,
          logged_in_user: req.user
        });
    });
  } else {
    // not logged in.
    req.flash('errors', { msg: 'Please <a href="/login/">log in</a> to view the schedule.' });
    res.redirect('/');    
  }

};

exports.postSchedule = function(req, res) {

  var schedule = new Schedule({
    date: req.body.date,
    name: req.body.name
  });

  schedule.save(function(err) {
    if (err) return next(err);
    req.flash('success', { msg: 'Added ' +req.body.name+ ' to the schedule for ' +req.body.date });
    res.redirect('/schedule');
  });
};

exports.deleteSchedule = function(req, res) {

  console.log('deleting schedule ' +req.params.id);

  Schedule.findById(req.params.id, function(err, schedule) {
    if (err) return next(err);
    console.log("Schedule found: ", schedule);
    schedule.deleted = true;

    schedule.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Removed ' +schedule.name+ ' to the schedule for ' +schedule.date });
      res.redirect('/schedule');
    });
  });

};
