define ["app"],
(app) ->

  class Resource extends Backbone.Model

    # url: "/:slug"

    defaults:
      id: ""
      title: ""
      # slug: ""
      type: ""
      description: ""
      link: ""
      clicked: false
      rating: 0.5 # rating a value between 0 and 1

  Resource
