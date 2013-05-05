define ["marionette"], (Marionette) ->

  class Resource extends Backbone.Model

    defaults:
      id: null
      path: ""
      topic: ""
      title: ""
      mediaType: []
      description: ""
      link: ""
      author: 
        name: ""
        twitter: ""
        facebook: ""
        google: ""
      cost: null
