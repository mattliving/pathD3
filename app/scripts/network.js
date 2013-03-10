define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    var Network = function() {
        var allData, curNodesData, curLinksData,
            links, nodes, force,
            svg, linksG, nodesG,
            w = parseInt($('#svg').css('width'), 10),
            h = 560,
            radius = 70;

        /* Main implementation to be returned */
        var network = function(selection, data) {
            /* Format initial json data */
            allData = setupData(data);

            /* Setup our force layout */
            force = d3.layout.force()
                .on('tick', tick)
                .gravity(0)
                .charge(-150)
                .linkDistance(300)
                .size([w, h]);

            /* Create our main svg element */
            svg = d3.select(selection).append('svg')
                .attr('width', w)
                .attr('height', h);

            /* Create the svg bounding box */
            svg.append('svg:rect')
                .attr('width', w)
                .attr('height', h)
                .attr('fill', 'none')
                .style('stroke', '#251400')
                .style('opacity', 0.8);

            linksG = svg.append('g').attr('id', 'links');
            nodesG = svg.append('g').attr('id', 'nodes');

            update();
        };

        function update() {
            curLinksData = filterLinks(allData.links, curNodesData);

            force.links(curLinksData);
            updateLinks();
            force.nodes(curNodesData);
            updateNodes();
            
            force.start();
        }

        function setupData(data) {
            var nodesMap = mapNodes(data.nodes);
            data.links.forEach(function(l) {
                l.source = nodesMap.get(l.source);
                l.target = nodesMap.get(l.target);
            });
            curNodesData = data.nodes.filter(function(d) {
                if (d.id === 'HTML' || d.id === 'CSS' || d.id === 'JavaScript') {
                    return d;
                }
            });
            return data;
        }

        /* Helper function to map node IDs to node objects.
           Returns d3.map of IDs to nodes */
        function mapNodes(nodes) {
            var nodesMap = d3.map();
            nodes.forEach(function(n) { nodesMap.set(n.id, n); });
            return nodesMap;
        }

        function filterNodes(allNodes) {
            var filteredNodes = allNodes.filter(function(d) {
                if (d.id === 'HTML' || d.id === 'CSS' || d.id === 'JavaScript') return d;
            });
            return filteredNodes;
        }

        function filterLinks(allLinks, curNodes) {
            curNodes = mapNodes(curNodes);
            return allLinks.filter(function(l) {
                return curNodes.get(l.source.id) && curNodes.get(l.target.id);
            });
        }

        function updateLinks() {
            links = linksG.selectAll('.link')
                .data(curLinksData, function(d) { return d.source.id + '-' + d.target.id; });
                
            links.enter().append('line')
                .attr('class', 'link');

            links.exit().remove();
        }

        function updateNodes() {
            nodes = nodesG.selectAll('.node')
                .data(curNodesData, function(d) { return d.id; });

            var nodeEnter = nodes.enter().append('g')
                .attr('class', 'node')
                .call(force.drag);

            nodeEnter.append('circle')
                .attr('r', 0)
                .style('fill', '#eee')
                .transition()
                .duration(1000)
                .attr('r', radius - 2);

            nodeEnter.append('text')
                .attr('text-anchor', 'middle')
                .style('font-size', '0px')
                .text(function(d) { return d.id; })
                .transition()
                .duration(1000)
                .attr('dy', '.3em')
                .style('font-size', '20px');

            nodes
                .on('mouseover', function(d) {
                    if (!d.selected) d3.select(this).select('circle').style('fill', '#ff7700');
                })
                .on('mouseout', function(d) {
                    if (!d.selected) d3.select(this).select('circle').style('fill', '#eee');
                })
                .on('click', function(d) {
                    addChildren(d);
                    toggleSelected(d);
                });

            nodes.exit().remove();
        }

        function addChildren(d) {
            /* O(n^2) may need optimization - perhaps convert data.nodes into map */ 
            if (d.selected === false) {
                curNodesData.length = 0;
                curNodesData.push(d);
                allData.links.forEach(function(e, i) {
                    if (e.source.id === d.id && curNodesData.indexOf(e.target) === -1) {
                        curNodesData.push(e.target);
                    }
                    else if (e.target.id === d.id && curNodesData.indexOf(e.source) === -1) {
                        curNodesData.push(e.source);
                    }
                });
                update();
            }
        }

        function toggleSelected(d) {
            nodes.each(function(e) { if (d !== e) e.selected = false; });
            d.selected = d.selected ? false : true;

            nodes.selectAll('circle').style('fill', function(e) {
               return e.selected ? '#3b9ece' : '#eee';
            });
        }

        function tick(e) {
            nodes.attr('transform', function(d) {
                /* The currently selected node will go to and stay in the center */
                if (d.selected == true) {
                    var damper = 0.1;
                    d.x = d.x + (w/2 - d.x) * (damper + 0.71) * e.alpha;
                    d.y = d.y + (h/2 - d.y) * (damper + 0.71) * e.alpha;
                }

                /* Bounding box effect */
                d.x = Math.max(radius, Math.min(w - radius, d.x));
                d.y = Math.max(radius, Math.min(h - radius, d.y));

                return 'translate(' + d.x + ',' + d.y + ')';
            });
 
            links
                .attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });
        }

        // Resolve collisions between nodes
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodesG.selectAll('circle'));
            return function(d) {
                var padding = 1,
                    r = radius + padding,
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = radius + radius + padding;
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2
                        || x2 < nx1
                        || y1 > ny2
                        || y2 < ny1;
                });
            };
        }

        return network;
    };
    return Network;
});