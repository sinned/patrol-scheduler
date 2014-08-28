/**
 *  Controllers for Content Pages
 */

exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.join = function(req, res) {
  res.render('join', {
    title: 'Join'
  });
};
