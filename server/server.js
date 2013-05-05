(function() {
  var Resource, app, express, http, mongoose, path, routes;

  express = require('express');

  http = require('http');

  mongoose = require('mongoose');

  path = require('path');

  routes = require('./routes');

  Resource = require('./models/resource').Resource;

  app = express();

  app.configure(function() {
    app.set('port', process.env.port || 3000);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express["static"]('../app'));
  });

  mongoose.connect('mongodb://localhost/didactly');

  app.get('/scripts/*', function(req, res) {
    return res.sendfile(path.resolve('../.tmp' + req.url));
  });

  app.get('/styles/*', function(req, res) {
    return res.sendfile(path.resolve('../.tmp' + req.url));
  });

  app.get("/:topic/resources/all", function(req, res) {
    return Resource.find().where('topic', req.params.topic).exec(function(err, resources) {
      if (!err) {
        return res.json(resources);
      } else {
        return console.log(err);
      }
    });
  });

  app.get("/:topic/resources/:type", function(req, res) {
    return Resource.find().where('topic')["in"]([req.params.topic]).where('mediaType')["in"]([req.params.type]).exec(function(err, resources) {
      if (!err) {
        return res.json(resources);
      } else {
        return console.log(err);
      }
    });
  });

  http.createServer(app).listen(app.get('port'), function() {
    return console.log('Express server listening on port ' + app.get('port'));
  });

}).call(this);
