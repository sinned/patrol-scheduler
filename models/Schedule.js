var mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
  date: { type: Date },
  name: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false } // keep deleted as own field to preserve doc.
});

module.exports = mongoose.model('Schedule', scheduleSchema);
