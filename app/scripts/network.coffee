define ["jquery", "d3"], ($, d3) ->

    Network = ->
        allData = undefined
        curNodesData = undefined
        curLinksData = undefined
        links = undefined
        nodes = undefined
        force = undefined
        svg = undefined
        linksG = undefined
        nodesG = undefined
        w = parseInt($("#mainview").css("width"), 10)
        h = parseInt($("#mainview").css("height"), 10)
        radius = 70

        # Main implementation to be returned
        network = (selection, data) ->
            # Format initial json data
            allData = setupData(data)

            # Setup our force layout
            force = d3.layout.force()
            .on("tick", tick)
            .gravity(0)
            .charge(-150)
            .linkDistance(300)
            .size([w, h])

            # Create our main svg element 
            svg = d3.select(selection)
                .append("svg")
                .attr("width", w)
                .attr("height", h)
            
            # Create the svg bounding box 
            svg.append("svg:rect")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "none")

            linksG = svg.append("g")
                .attr("id", "links")
            nodesG = svg.append("g")
                .attr("id", "nodes")

            update()
        
        update = ->
          curLinksData = filterLinks(allData.links, curNodesData)

          force.links(curLinksData)
          updateLinks()
          force.nodes(curNodesData)
          updateNodes()

          force.start()

        setupData = (data) ->
          nodesMap = mapNodes(data.nodes)
          data.links.forEach (l) ->
            l.source = nodesMap.get(l.source)
            l.target = nodesMap.get(l.target)

          curNodesData = data.nodes.filter((d) ->
            d if d.id is "HTML" or d.id is "CSS" or d.id is "JavaScript"
          )

          data
        
        # Helper function to map node IDs to node objects.
        # Returns d3.map of IDs to nodes 
        mapNodes = (nodes) ->
          nodesMap = d3.map()
          nodes.forEach (n) ->
            nodesMap.set(n.id, n)

          nodesMap

        filterNodes = (allNodes) ->
          filteredNodes = allNodes.filter((d) ->
            d if d.id is "HTML" or d.id is "CSS" or d.id is "JavaScript"
          )
          filteredNodes

        filterLinks = (allLinks, curNodes) ->
          curNodes = mapNodes(curNodes)
          allLinks.filter (l) ->
            curNodes.get(l.source.id) and curNodes.get(l.target.id)

        updateLinks = ->
            links = linksG.selectAll(".link")
                .data(curLinksData, (d) -> d.source.id + "-" + d.target.id)
            
            links.enter()
                .append("line")
                .attr("class", "link")
            
            links.exit().remove()

        updateNodes = ->
            nodes = nodesG.selectAll(".node").data(curNodesData, (d) -> d.id)

            nodeEnter = nodes.enter()
                .append("g")
                .attr("class", "node")
                .call(force.drag)

            nodeEnter.append("circle")
                .attr("r", 0)
                .style("fill", "#f5f5f5")
                .transition()
                .duration(1000)
                .attr("r", radius - 2)

            nodeEnter.append("text")
                .attr("text-anchor", "middle")
                .style("font-size", "0px")
                .text((d) -> d.id)
                .transition()
                .duration(1000)
                .attr("dy", ".3em")
                .style("font-size", "20px")

            nodes
                .on "mouseover", (d) ->
                    d3.select(this).select("circle").style("fill", "#ff7700") unless d.selected
                .on "mouseout", (d) ->
                    d3.select(this).select("circle").style("fill", "#f5f5f5") unless d.selected
                .on "click", (d) ->
                    addChildren d
                    toggleSelected d

            nodes.exit().remove()

        addChildren = (d) ->
            # O(n^2) may need optimization - perhaps convert data.nodes into map 
            if d.selected is false
                curNodesData.length = 0
                curNodesData.push(d)
                allData.links.forEach (e, i) ->
                    if e.source.id is d.id and curNodesData.indexOf(e.target) is -1
                        curNodesData.push(e.target)
                    else curNodesData.push(e.source) if e.target.id is d.id and curNodesData.indexOf(e.source) is -1

            update()

        toggleSelected = (d) ->
            nodes.each (e) -> e.selected = false if d isnt e
            d.selected = (if d.selected then false else true)

            nodes.selectAll("circle").style("fill", (e) ->
                (if e.selected then "#3b9ece" else "#eee")
            )

        tick = (e) ->
            nodes.attr("transform", (d) ->

                # The currently selected node will go to and stay in the center 
                if d.selected is true
                    damper = 0.1
                    d.x = d.x + (w / 2 - d.x) * (damper + 0.71) * e.alpha
                    d.y = d.y + (h / 2 - d.y) * (damper + 0.71) * e.alpha

                # Bounding box effect 
                d.x = Math.max(radius, Math.min(w - radius, d.x))
                d.y = Math.max(radius, Math.min(h - radius, d.y))
                
                "translate(" + d.x + "," + d.y + ")"
            )

            links
                .attr("x1", (d) -> d.source.x)
                .attr("y1", (d) -> d.source.y)
                .attr("x2", (d) -> d.target.x)
                .attr("y2", (d) -> d.target.y)
        
        # Resolve collisions between nodes
        collide = (alpha) ->
            quadtree = d3.geom.quadtree(nodesG.selectAll("circle"))
            (d) ->
                padding = 1
                r = radius + padding
                nx1 = d.x - r
                nx2 = d.x + r
                ny1 = d.y - r
                ny2 = d.y + r
                quadtree.visit (quad, x1, y1, x2, y2) ->
                    if quad.point and (quad.point isnt d)
                        x = d.x - quad.point.x
                        y = d.y - quad.point.y
                        l = Math.sqrt(x * x + y * y)
                        r = radius + radius + padding
                        if l < r
                            l = (l - r) / l * alpha
                            d.x -= x *= l
                            d.y -= y *= l
                            quad.point.x += x
                            quad.point.y += y
                            x1 > nx2 or x2 < nx1 or y1 > ny2 or y2 < ny1

        network

    Network
