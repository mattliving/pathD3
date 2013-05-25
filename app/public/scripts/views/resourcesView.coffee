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
        @collection.url = "/webdevelopment/" + topic.toLowerCase()
        @collection.fetch success: =>
          @cached = new Backbone.Collection @collection.models
          $("a[rel=tooltip]").tooltip(options)

      vent.on "filter", (params) =>

        @collection.reset @cached.models, {silent: true}

        if params.mediaType? and params.mediaType isnt "all"
          @collection.models = _.filter @collection.models, (resource) =>
            _.contains resource.get('mediaType'), params.mediaType

        if params.level? and params.level isnt "all"
          @collection.models = @collection.where level: params.level

        @render()

        # @collection.url = @baseUrl + "/" + params.type
        # if params.level? and params.level isnt "all"
        #   @collection.url = @collection.url + "/" + params.level
        # @collection.fetch success: ->
        #   $("a[rel=tooltip]").tooltip(options)

