define [
  "marionette", 
  "helpers/vent"],
(Marionette, vent) ->

  class SidebarLayout extends Marionette.Layout

    id: 'sideBarLayout'

    template: '#sidebarLayout'

    regions:
      filter: '#filter'
      resources: '#resources'
      