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
      h = $('.container-fluid').height()
      offsetTop = 40
      $('#main').css('height', (h - offsetTop))
      $('#side').css('height', (h - offsetTop))
    ).resize()

  app.addInitializer ->
    app.side.show(sidebar)
    sidebar.filter.show new FilterView()
    sidebar.resources.show new ResourcesView(collection: new Resources())

  $('#pathDD .dropdown-menu a').click (e) =>
    data =
      nodes: []
      links: []
    $.ajax(
      url: e.target.id + '/topics'
    ).done (topics) ->
      for topic in topics
        data.nodes.push 
          id: topic.name
          description: topic.description
        for d in topic.dependancies
          for name of d
            data.links.push
              source: name
              target: topic.name

      network = new NetworkView('#main', data)

  return app