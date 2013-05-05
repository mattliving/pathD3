express  = require 'express'
http     = require 'http'
mongoose = require 'mongoose'
path     = require 'path'
routes   = require './routes'

# Create server
app = express()

app.configure ->
  app.set 'port', process.env.port || 3000
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static('../app')

mongoose.connect('mongodb://localhost/didactly')

# For dealing with the way grunt watch moves compiled files
app.get '/scripts/*', (req, res) -> res.sendfile path.resolve('../.tmp' + req.url)
app.get '/styles/*', (req, res) -> res.sendfile path.resolve('../.tmp' + req.url)

app.get "/:topic/resources/all", routes.resources.all
app.get "/:topic/resources/all/:level", routes.resources.allByLevel
app.get "/:topic/resources/:type", routes.resources.type
app.get "/:topic/resources/:type/:level", routes.resources.level

http.createServer(app).listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get 'port'
