define ["marionette", "network", "webdev"], (Marionette, Network, json) ->

	app = new Marionette.Application()

	app.addRegions
		side: '#side'
		main: '#main'

	$(window).resize( ->
			h = $(".container-fluid").height()
			offsetTop = 40
			$("#main").css("height", (h - offsetTop))
			$("#side").css("height", (h - offsetTop))
		).resize()

  app.addInitializer () ->
  	# viewOptions =
  	# 	collection : resourcesCollection

  	# app.side.show(new ResourcesView(viewOptions))
	network = new Network("#main", json)
	#network.network("#main", json)

	# d3.json('http://localhost/scripts/webdev.json', function(error, json) {
	#     network('#svg', json);
	# });
	# network("#main", json)

	app