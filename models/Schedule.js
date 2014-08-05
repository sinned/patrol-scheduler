var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
  date: { type: Date },
  name: { type: String, default: '' },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
