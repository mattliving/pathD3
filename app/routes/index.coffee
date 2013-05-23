Resource = require('../models/resource').Resource

exports.site = {}

exports.site.index = (req, res) ->
  # res.sendfile path.resolve(__dirname + req.url)

exports.resources = {}

exports.resources.all = (req, res) ->
  Resource.find().where('topic', req.params.topic).exec (err, resources) ->
    unless err
      res.json resources
    else
      console.log err

exports.resources.allByLevel = (req, res) ->
  Resource.find()
  .where('topic', req.params.topic)
  .where('level', req.params.level).exec (err, resources) ->
    unless err
      res.json resources
    else
      console.log err

exports.resources.type = (req, res) ->
  Resource.find()
  .where('topic').in([req.params.topic])
  .where('mediaType').in([req.params.type])
  .exec (err, resources) ->
    unless err
      res.json resources
    else
      console.log err

exports.resources.level = (req, res) ->
  Resource.find()
  .where('topic').in([req.params.topic])
  .where('mediaType').in([req.params.type])
  .where('level', req.params.level)
  .exec (err, resources) ->
    unless err
      res.json resources
    else
      console.log err