(function() {
  var Resource;

  Resource = require('../models/resource').Resource;

  exports.resources = {};

  exports.resources.all = function(req, res) {
    return Resource.find().where('topic', req.params.topic).exec(function(err, resources) {
      if (!err) {
        return res.json(resources);
      } else {
        return console.log(err);
      }
    });
  };

  exports.resources.allByLevel = function(req, res) {
    return Resource.find().where('topic', req.params.topic).where('level', req.params.level).exec(function(err, resources) {
      if (!err) {
        return res.json(resources);
      } else {
        return console.log(err);
      }
    });
  };

  exports.resources.type = function(req, res) {
    return Resource.find().where('topic')["in"]([req.params.topic]).where('mediaType')["in"]([req.params.type]).exec(function(err, resources) {
      if (!err) {
        return res.json(resources);
      } else {
        return console.log(err);
      }
    });
  };

  exports.resources.level = function(req, res) {
    return Resource.find().where('topic')["in"]([req.params.topic]).where('mediaType')["in"]([req.params.type]).where('level', req.params.level).exec(function(err, resources) {
      if (!err) {
        return res.json(resources);
      } else {
        return console.log(err);
      }
    });
  };

}).call(this);
