define ["marionette", "helpers/vent"], 
(Marionette, vent) ->
  
  class ResourceView extends Marionette.ItemView
  	
  	tagName: "li"

  	template: "#resourceTemplate"