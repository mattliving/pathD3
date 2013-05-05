define [
  "marionette", 
  "helpers/vent", 
  "views/emptyView", 
  "views/resourceView",
  "bootstrap.tooltip"], 
(Marionette, vent, EmptyView, ResourceView) ->

  class ResourcesView extends Marionette.CollectionView

    tagName: "ul"

    className: "nav nav-tabs nav-stacked"

    emptyView: EmptyView
    itemView: ResourceView

    initialize: ->
      options = 
        placement: "right"
        delay: 
          show: 300
          hide: 100

      vent.on "nodeClicked", (topic) =>
        vent.trigger "setTopic", topic
        @baseUrl = "/" + topic.toLowerCase() + "/resources"
        @collection.url = @baseUrl + "/all"
        @collection.fetch success: ->
          $("a[rel=tooltip]").tooltip(options)

      vent.on "filter", (type) =>
        @collection.url = @baseUrl + "/" + type
        @collection.fetch success: ->
          $("a[rel=tooltip]").tooltip(options)

