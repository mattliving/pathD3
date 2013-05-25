express  = require 'express'
http     = require 'http'
mongoose = require 'mongoose'
path     = require 'path'
routes   = require './routes'

# Create server
app = express()

app.configure ->
  app.set 'port', 3000
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.enable 'trust proxy'
  app.use express.static(__dirname + '/public')

mongoose.connect('mongodb://localhost/didactly')

app.get "/scripts/*", (req, res) -> res.sendfile ".tmp/public" + req.url
app.get "/styles/*", (req, res) -> res.sendfile ".tmp/public" + req.url

# app.get '/', routes.site.index

# Resources 
app.get '/:path', routes.resources.path
app.get '/:path/:topic', routes.resources.topic
# app.get '/:path/:topic?level=:level', routes.resources.level
# app.get '/:path/:topic?type=:type', routes.resources.type
# app.get '/:path/:topic?type=:type&level=:level', routes.resources.typeAndLevel

http.createServer(app).listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get 'port'
