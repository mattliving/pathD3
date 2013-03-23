require.config
  paths:
    backbone: "../components/backbone/backbone-min"
    underscore: "../components/underscore/underscore-min"
    jquery: "../components/jquery/jquery.min"
    d3: "../components/d3/d3.min"
    marionette: "../components/marionette/lib/backbone.marionette.min"
    bootstrap: "vendor/bootstrap"

  shim:
    jquery: 
      exports: "jQuery"
    underscore: 
      exports: "_"
    backbone: 
      deps: ["jquery", "underscore"]
      exports: "Backbone"
    marionette: 
      deps: ["jquery", "underscore", "backbone"]
      exports: "Marionette"
    d3:
      exports: "d3"
    bootstrap:
      deps: ["jquery"]

require ["app", "backbone"], (App, Backbone) ->
  
  App.start()
  Backbone.history.start()