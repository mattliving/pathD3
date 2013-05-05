(function() {
  var app, express, http, mongoose, path, routes;

  express = require('express');

  http = require('http');

  mongoose = require('mongoose');

  path = require('path');

  routes = require('./routes');

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

  app.get("/:topic/resources/all", routes.resources.all);

  app.get("/:topic/resources/all/:level", routes.resources.allByLevel);

  app.get("/:topic/resources/:type", routes.resources.type);

  app.get("/:topic/resources/:type/:level", routes.resources.level);

  http.createServer(app).listen(app.get('port'), function() {
    return console.log('Express server listening on port ' + app.get('port'));
  });

}).call(this);
