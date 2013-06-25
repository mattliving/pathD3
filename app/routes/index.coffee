Resource = require('../models/resource').Resource
Topic    = require('../models/topic').Topic

exports.site =

  index: (req, res) ->
  # res.sendfile path.resolve(__dirname + req.url)

  paths: (req, res) ->

  topics: (req, res) ->
    Topic.find {}, (err, topics) ->
      unless err
        res.json topics
      else console.log err

  topicsByName: (req, res) ->
    Topic.find {}, {'_id': 0, 'name': 1}, (err, topics) ->
      unless err
        res.json topics
      else console.log err

  topicDependancies: (req, res) ->
    Topic.find {}, {'_id': 0, 'dependancies': 1}, (err, topics) ->
      unless err
        res.json topics
      else console.log err

exports.resources =

  path: (req, res) ->
    Resource.find()
    .where('path', req.params.path).exec (err, resources) ->
      unless err 
        res.json resources
      else console.log err

  topic: (req, res) ->
    Resource.find()
    .where('path', req.params.path)
    .where('topic').in([req.params.topic]).exec (err, resources) ->
      unless err
        res.json resources
      else console.log err

  level: (req, res) ->
    Resource.find()
    .where('path', req.params.path)
    .where('topic').in([req.params.topic])
    .where('level', req.params.level).exec (err, resources) ->
      unless err
        res.json resources
      else console.log err

  type: (req, res) ->
    Resource.find()
    .where('path', req.params.path)
    .where('topic').in([req.params.topic])
    .where('mediaType').in([req.params.type])
    .exec (err, resources) ->
      unless err
        res.json resources
      else console.log err

  typeAndLevel: (req, res) ->
    Resource.find()
    .where('path', req.params.path)
    .where('topic').in([req.params.topic])
    .where('mediaType').in([req.params.type])
    .where('level', req.params.level)
    .exec (err, resources) ->
      unless err
        res.json resources
      else console.log err
