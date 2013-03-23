define ["marionette", "network", "webdev"], (Marionette, Network, json) ->

	App = new Marionette.Application()

	App.addRegions
		side: '#side'
		main: '#main'

	$(window).resize( ->
	    h = $(".container-fluid").height()
	    offsetTop = 40
	    $("#main").css("height", (h - offsetTop))
	    $("#side").css("height", (h - offsetTop))
	).resize()

	network = Network()

	# d3.json('http://localhost/scripts/webdev.json', function(error, json) {
	#     network('#svg', json);
	# });
	network("#main", json)

	App