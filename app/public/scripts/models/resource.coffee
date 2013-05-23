define ["marionette"], (Marionette) ->

  class Resource extends Backbone.Model

    defaults:
      id: null
      path: ""
      topic: []
      level: ""
      title: ""
      mediaType: []
      description: ""
      link: ""
      authors: [ 
        name: ""
        twitter: ""
        facebook: ""
        google: ""
      ]
      cost: null
