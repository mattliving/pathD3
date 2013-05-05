define [
  "marionette", 
  "helpers/vent",
  "views/sidebarLayout",
  "views/networkView",
  "views/filterView", 
  "views/resourcesView",
  "collections/resources",
  "webdev"],
(Marionette, vent, SidebarLayout, NetworkView, FilterView, ResourcesView, Resources, webdevData) ->

  app     = new Marionette.Application()
  sidebar = new SidebarLayout()

  app.addRegions
    side: '#side'
    main: '#main'

  $(window).resize( ->
      h = $(".container-fluid").height()
      offsetTop = 40
      $("#main").css("height", (h - offsetTop))
      $("#side").css("height", (h - offsetTop))
    ).resize()

  app.addInitializer ->
    app.side.show(sidebar)
    sidebar.filter.show new FilterView()
    sidebar.resources.show new ResourcesView(collection: new Resources())

  network = new NetworkView("#main", webdevData)

  return app