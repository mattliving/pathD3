define [
  "app",
  "models/resource"
],
(app, ResourceModel) ->
  
  class ResourceCollection extends Backbone.Collection

    model: ResourceModel

  ResourceCollection
