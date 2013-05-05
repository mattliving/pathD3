define ["marionette", "helpers/vent"], 
(Marionette, vent) ->

	class NoItemsView extends Marionette.ItemView
		
		template: $("#noItemsTemplate")