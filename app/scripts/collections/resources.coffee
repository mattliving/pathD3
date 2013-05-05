define ["marionette", "models/resource"],
(Marionette, Resource) ->
  
  class Resources extends Backbone.Collection

    model: Resource

    comparator: (model) ->
      model.get('title')
