mongoose = require 'mongoose'

Resource = mongoose.model 'Resource', new mongoose.Schema(
  path: String
  topic: [String]
  level: String
  title: String
  mediaType: [String]
  description: String
  link: String
  authors: [
    name: String
    twitter: String
    facebook: String
    google: String
  ]
  cost: Number
)

module.exports = 
  Resource: Resource