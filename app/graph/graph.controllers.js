/*------------------------------------------------------------------------------------
    List of contributors: https://github.com/MSFOCBA
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

graphModule.controller('graphMainController', ['$scope', '$translate', 'dossiersServicesFactory', 'dossiersServiceDataSetsFactory', 'dossiersSectionsFactory', function($scope, $translate, dossiersServicesFactory, dossiersServiceDataSetsFactory, dossiersSectionsFactory) {
    ping();

    $('#graph').tab('show');
    $scope.loaded = false;

    var createNode = function(id, group, name, description) {
        return {
            "id":           id,
            "group":        group,
            "name":         name,
            "description":  description
        }
    }
    var nodeList = [];
    var nodeExist = {};

    var createLink = function(sourceNode, targetNode) {
        return {
            "source":       sourceNode.id,
            "sourceGroup":  sourceNode.group,
            "target":       targetNode.id,
            "targetGroup":  targetNode.group
        }
    }
    var linkList = [];

    var updateSearch = function(searchTerm) {
        var searchRegEx;
        searchRegEx = new RegExp(searchTerm.toLowerCase());
        return node.each(function(d) {
            var element, match;
            element = d3.select(this);
            match = d.name.toLowerCase().search(searchRegEx);
            if (searchTerm.length > 0 && match >= 0) {
                element.style("stroke-width", 2.0).style("stroke", "#555");
                return d.searched = true;
            }
        });
    };

    startLoadingState(false);

    dossiersServicesFactory.get(function(services) {
        var queriesStatus = [];

        function isTrue(element) {
            return element;
        };

        /*
         * 1) Get services
         *
         * 2) a. Get datasets
         * 2) b. Get sections
         *
         * 3) a. Get indicatorgroups
         * 3) b. Get indicators
         *
         * 4) Get dataelements
         */

        services.organisationUnitGroups.forEach(function(oug, oug_num) {

            // 1) Get services
            nodeList.push(createNode(oug.id, "Services", oug.displayName));

            dossiersServiceDataSetsFactory.get({
                serviceCode: '_' + oug.code.split('_')[2]
            }, function(datasets) {

                datasets.dataSets.forEach(function(ds, ds_num) {

                    if (!nodeExist[ds.id]) {
                        queriesStatus[1000 * oug_num + ds_num] = false;

                        nodeExist[ds.id] = true;

                        // 2) a. Get datasets
                        nodeList.push(createNode(ds.id, "dataSets", ds.displayName));

                        dossiersSectionsFactory.get({
                            datasetId: ds.id
                        }, function(sections) {

                            sections.sections.forEach(function(sec) {

                                if (!nodeExist[sec.id]) {
                                    nodeExist[sec.id] = true;

                                    // 2) b. Get sections
                                    nodeList.push(createNode(sec.id, "Sections", sec.displayName));
                                }
                                linkList.push(createLink(ds.id, sec.id));
                            });
                            queriesStatus[1000 * oug_num + ds_num] = true;
                            if (queriesStatus.every(isTrue)) {
                                console.log('graph: All queries finished');
                                $scope.loaded = true;
                            }
                        });
                    }
                    linkList.push(createLink(oug.id, ds.id));
                });

            });
        });
    });

    $scope.$watch('loaded', function() {
        if ($scope.loaded) {
            $scope.nodeList = nodeList;

            var width = $("#d3graph").width();
            var height = $(window).height() * 0.75;
            var transform = d3.zoomIdentity;
            var groupList = {};

            var svg = d3.select("#d3graph").append("svg")
                .attr("width", width)
                .attr("height", height)
                .call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", zoomed))
                .on("dblclick.zoom", null)
                .append("g")
                .attr("transform", "translate(40,0)");


            function zoomed() {
                svg.attr("transform", d3.event.transform);
            }

            var color = d3.scaleOrdinal(d3.schemeCategory20);

            groupList.size = {
                Services: 5,
                dataSets: 4,
                Sections: 3
            };

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function(d) {
                    return d.id;
                }))
                .force("charge", d3.forceManyBody().strength(-50))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("y", d3.forceY(0))
                .force("x", d3.forceX(0));

            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(linkList)
                .enter().append("line");

            var gnode = svg.append("g")
                .selectAll(".nodes")
                .data(nodeList)
                .enter();

            var node = gnode.append("circle")
                .attr("id", function(d) {
                    return d.name;
                })
                .attr("class", "nodes")
                .attr("r", function(d) {
                    return groupList.size[d.group];
                })
                .attr("fill", function(d) {
                    return color(d.group);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
                .on('dblclick', connectedNodes);

            var label = gnode.append("text")
                .attr("class", "labels")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("class", function(d) {
                    return "label-" + d.group
                })
                .text(function(d) {
                    return d.name;
                });

            simulation
                .nodes(nodeList)
                .on("tick", ticked);

            simulation
                .force("link")
                .links(linkList);


            function ticked() {
                link
                    .attr("x1", function(d) {
                        return d.source.x;
                    })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

                node
                    .attr("cx", function(d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
                    });

                label
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function(d) {
                        return d.y;
                    });
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }


            // Toggles children N+1 & N+2 (Services -> Sections)

            //Toggle stores whether the highlighting is on
            var toggle = 0;
            //Create an array logging what is connected to what
            var linkedByIndex = {};
            for (i = 0; i < nodeList.length; i++) {
                linkedByIndex[i + "," + i] = 1;
            };

            // n+1
            var linkedByIndexN1 = {};
            linkList.forEach(function(d1) {
                linkedByIndex[d1.source.index + "," + d1.target.index] = 1;
                linkedByIndexN1[d1.source.index + "," + d1.target.index] = 1;
            });

            function neighboringN1(a, b) {
                return linkedByIndexN1[a.index + "," + b.index];
            }

            // n+2
            var linkedByIndexN2 = {};
            nodeList.forEach(function(d1) {
                nodeList.forEach(function(d2) {
                    if (neighboringN1(d1,d2)) {
                        nodeList.forEach(function(d3) {
                            if (neighboringN1(d2,d3)) {
                                linkedByIndex[d1.index + "," + d3.index] = 1;
                                linkedByIndexN2[d1.index + "," + d3.index] = 1;
                            }
                        });
                    }
                });
            });

            function neighboring(a, b) {
                return linkedByIndex[a.index + "," + b.index];
            }
            //This function looks up whether a pair are neighbours

            function connectedNodes() {
                if (toggle == 0) {
                    //Reduce the opacity of all but the neighbouring nodes
                    d = d3.select(this).node().__data__;
                    node.style("opacity", function(o) {
                        return neighboring(d, o) /*| neighboring(o, d)*/ ? 1 : 0.1;
                    });
                    link.style("opacity", function(o1) {
                        var temp = false;
                        if (d.index == o1.source.index) {
                            temp = true;
                        }
                        nodeList.forEach(function(o2) {
                            if (neighboringN1(d,o2)) {
                                if (o2.index == o1.source.index) {
                                    temp = true;
                                }
                            }
                        });
                        return temp /*| d.index == o.target.index*/ ? 1 : 0.1;
                    });
                    label.style("opacity", function(o) {
                        return neighboring(d, o) /*| neighboring(o, d)*/ ? 1 : 0.1;
                    });
                    //Reduce the op
                    toggle = 1;
                } else {
                    //Put them back to opacity=1
                    node.style("opacity", 1);
                    link.style("opacity", 1);
                    label.style("opacity", 1);
                    toggle = 0;
                }
            }

            $scope.nodeSelected = function(selected) {
                if (selected) {
                    //find the node
                    console.log("graph: Selected node: " + selected.title);
                    var selectedVal = document.getElementById(selected.title).value;
                    var node = svg.selectAll(".nodes");
                    if (selectedVal == "none") {
                        node.style("stroke", "white").style("stroke-width", "1");
                    } else {
                        var selected_node = node.filter(function (d, i) {
                            return d.name != selected.title;
                        });
                        selected_node.style("opacity", "0");
                        var link = svg.selectAll(".links")
                        link.style("opacity", "0");
                        var label = svg.selectAll("text")
                        var filtered_label = label.filter(function (d, i) {
                            return d.name != selected.title;
                        });
                        filtered_label.style("opacity", "0");
                        d3.selectAll(".nodes, .links, text").transition()
                            .duration(5000)
                            .style("opacity", 1);
                    }
                } else {
                    console.log("graph: Selection cleared");
                }
            };

            endLoadingState();

            groupList.list = ["Services", "dataSets", "Sections"];
            $scope.optArray = groupList.list;

            legend = d3.select("#d3graph").append("svg")
                .attr('class', 'legend')
                .append('g')
                .attr('x', 0)
                .attr('y', 0)
                .selectAll('.group')
                .data(d3.values(groupList.list))
                .enter().append('g')
                .attr('class', 'category');

            var legendConfig = {
                rectWidth: 12,
                rectHeight: 12,
                xOffset: 0,
                yOffset: 30,
                xOffsetText: 20,
                yOffsetText: 10,
                lineHeight: 15
            };

            legendConfig.yOffsetText += legendConfig.yOffset;

            legend.append('rect')
                .attr('x', legendConfig.xOffset)
                .attr('y', function(d, i) {
                    return legendConfig.yOffset + i * legendConfig.lineHeight;
                })
                .attr('height', legendConfig.rectHeight)
                .attr('width', legendConfig.rectWidth)
                .attr('fill', function(d) {
                    return color(d);
                })
                .attr('stroke', function(d) {
                    //return graph.strokeColor(d.key);
                });

            legend.append('text')
                .attr('x', legendConfig.xOffsetText)
                .attr('y', function(d, i) {
                    return legendConfig.yOffsetText + i * legendConfig.lineHeight;
                })
                .text(function(d) {
                    return d;
                });
        }
    });
}]);
