express    = require 'express'
http       = require 'http'
mongoose   = require 'mongoose'
path       = require 'path'
routes     = require './routes'
Resource = require('./models/resource').Resource

# Create server
app = express()

app.configure ->
  app.set 'port', process.env.port || 3000
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static('../app')

mongoose.connect('mongodb://localhost/didactly')


# app.get '/', routes.index
# For dealing with the way grunt watch moves compiled files
app.get '/scripts/*', (req, res) -> res.sendfile path.resolve('../.tmp' + req.url)
app.get '/styles/*', (req, res) -> res.sendfile path.resolve('../.tmp' + req.url)

app.get "/:topic/resources/all", (req, res) ->
  Resource.find().where('topic', req.params.topic).exec (err, resources) ->
    unless err
      res.json resources
    else
      console.log err

app.get "/:topic/resources/:type", (req, res) ->
  Resource.find()
  .where('topic').in([req.params.topic])
  .where('mediaType').in([req.params.type])
  .exec (err, resources) ->
    unless err
      res.json resources
    else
      console.log err

# app.get '*', (req, res) -> res.send '404', 404

http.createServer(app).listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get 'port'
