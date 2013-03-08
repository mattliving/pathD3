define(['jquery', 'd3'], function ($, d3) {
    'use strict';

    var Network = function() {
        var allData, curNodesData, curLinksData, 
            links, nodes, force, 
            svg, linksG, nodesG,
            w = parseInt($('#svg').css('width'), 10),
            h = 560,
            r = 70,
            z = d3.scale.category20c();

        var network = function(selection, data) {
            /* Format initial json data */
            allData = setupData(data);

            /* Setup our force layout */
            force = d3.layout.force()
                .on('tick', tick)
                .gravity(0)
                .charge(-30)
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
        }

        function update() {
            // curNodesData = filterNodes(allData.nodes);
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
                if (d.id == "HTML" || d.id == "CSS" || d.id == "JavaScript") {
                    d.visible = true;
                    return d;
                }
            });
            return data;
        }

        /* Helper function to map node IDs to node objects.
           Returns d3.map of IDs to nodes */
        function mapNodes(nodes) {
            var nodesMap = d3.map();
            nodes.forEach(function(n) { nodesMap.set(n.id, n) });
            return nodesMap;
        }

        function filterNodes(allNodes) {
            var filteredNodes = allNodes.filter(function(d) {
                if (d.id == "HTML" || d.id == "CSS" || d.id == "JavaScript") return d;
            });
            return filteredNodes;
        }

        function filterLinks(allLinks, curNodes) {
            curNodes = mapNodes(curNodes);
            return allLinks.filter(function(l) {
                return curNodes.get(l.source.id) && curNodes.get(l.target.id);
            });
        };

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
                .attr('r', r - 0.75);

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
                    if (!d.selected)
                        d3.select(this).select('circle').style('fill', '#FF7700'); 
                })
                .on('mouseout', function(d) { 
                    if (!d.selected)
                        d3.select(this).select('circle').style('fill', '#eee'); 
                })
                .on('click', function(d) { 
                    addChildren(d); 
                    toggleSelected(d, this);
                });

            // var nodeExit = d3.transition(nodes.exit())
            //     .remove();

            nodes.exit().remove();

            // nodeExit.select('circle')
            //     .transition()
            //     .duration(500)
            //     .attr('r', 5);

            // nodeExit.select('text')
            //     .transition()
            //     .duration(500)
            //     .style('font-size', '0px');
        }

        function addChildren(d) {
            /* O(n^2) needs optimization - perhaps convert data.nodes into map */ 
            if (d.selected == false) {
                curNodesData = [];
                curNodesData.push(d);
                allData.links.forEach(function(e) {
                    if (e.source.id == d.id && curNodesData.indexOf(e.target) == -1) {
                        curNodesData.push(e.target);
                    }
                    if (e.target.id == d.id && curNodesData.indexOf(e.source) == -1) {
                        curNodesData.push(e.source);
                    }
                });
                update();
            }   
        }

        function toggleSelected(d, context) {
            nodes.each(function(e) { if (d !== e) e.selected = false });
            d.selected = d.selected ? false : true; 

            nodes.selectAll('circle').style('fill', function(e) {
               return e.selected ? '#3B9ECE' : '#eeeeee';
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
                // .each(cluster(10 * e.alpha * e.alpha))
                // .each(collide(.5))

                /* Bounding box effect */
                d.x = Math.max(r, Math.min(w - r, d.x));
                d.y = Math.max(r, Math.min(h - r, d.y));

                return 'translate(' + d.x + ',' + d.y + ')';
            }); 
            links
                .attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });
        }

        // Move d to be adjacent to the cluster node
        function cluster(alpha) {
            var max = {};

            // Find the largest node for each cluster
            nodes.forEach(function(d) {
                if (!(d.color in max) || (d.radius > max[d.color].radius)) {
                    max[d.color] = d;
                }
            });

            return function(d) {
                var node = max[d.color],
                l,
                r,
                x,
                y,
                k = 1,
                i = -1;

                // For cluster nodes, apply custom gravity
                if (node == d) {
                    node = {x: w / 2, y: y / 2, radius: -d.radius};
                    k = .1 * Math.sqrt(d.radius);
                }

                x = d.x - node.x;
                y = d.y - node.y;
                l = Math.sqrt(x * x + y * y);
                r = d.radius + node.radius;
                if (l != r) {
                    l = (l - r) / l * alpha * k;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    node.x += x;
                    node.y += y;
                }
            };
        }

        // Resolves collisions between d and all other circles
        function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
                return function(d) {
                    var r = d.radius + radius.domain()[1] + padding,
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function(quad, x1, y1, x2, y2) {
                        if (quad.point && (quad.point !== d)) {
                            var x = d.x - quad.point.x,
                            y = d.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
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
    }
    return Network;
});