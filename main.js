let color_node_fill     = '#444444';
let color_node_outline  = '#666666';
let color_node_text     = '#DDDDDD';

let color_binding       = '#666666';

var link, node, title ;

function generateNodes()
{

  var words = [
    {
        "depth":"0",
        "group":"Root",
        "name":"Root",
        "children":[
            {
                "depth":"1",
                "group":"A",
                "name":"A"
            },
            {
                "depth":"1",
                "group":"B",
                "name":"B",
                "children":[
                    {
                        "depth":"2",
                        "group":"B",
                        "name": "C"
                    },
                    {
                        "depth":"2",
                        "group":"B",
                        "name": "D",
                        "children":[
                            {
                                "depth":"3",
                                "group":"B",
                                "name": "E"
                            },
                            {
                                "depth":"3",
                                "group":"B",
                                "name": "F"
                            }
                        ]
                    },
                    {
                        "depth":"2",
                        "group":"B",
                        "name":"G"
                    }
                ]
            },
            {
                "depth":"1",
                "group":"C",
                "name":"H"
            },
            {
                "depth":"1",
                "group":"D",
                "name":"I",
                "children":[
                    {
                        "depth":"2",
                        "group":"D",
                        "name":"J"
                    },
                    {
                        "depth":"2",
                        "group":"D",
                        "name":"K"
                    }
                ]
            }
        ]
    }
  ]


  var w = window.outerWidth,
  	h = window.outerHeight,
  	root;

  var zoom = d3.behavior.zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", zoomed);

  var svg = d3.select("#main").append("svg")
  	.attr("width", "100%")
  	.attr("height", "100%")
    .call(zoom);

  root = words[0]; //set root node
  root.fixed = true;
  root.x = w / 2;
  root.y = h / 2 - 80;

  var nodes = flatten(root),
  links = d3.layout.tree().links(nodes);

  // Update the links…
  link = svg.selectAll(".link")
    .data(links);

  // Enter any new links.
  link.enter().insert("svg:line", ".node")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .style("stroke", color_binding);

  node = svg.selectAll("circle.node")
    .data(nodes)
    .style("fill", color);

  node.transition()
    .attr("r", getRadius);

  // Enter any new nodes.
  node.enter().append("svg:circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", getRadius)
    .style("fill", color)
    .style("stroke", color_node_outline)
    .style("stroke-width", "1")
    .on("click", click);

    //.call(clicked);

    title = svg.selectAll("text.title")
         .data(nodes);

    // Enter any new titles.
    title.enter()
        .append("text")
        .attr("class", "title")
        .attr("font-size", 15 + "px")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", color_node_text)
        .style("font-family", "Roboto, sans-serif")
        .style("paint-order", "stroke")
        .style("stroke", "#333333")
        .style("stroke-width", "2px")
        .text(function(d) { return d.name; });

    var force = d3.layout.force()
      .on("tick", tick)
      .charge(-500)
      .linkDistance(function(link){
        var dist = 150 - (25)*(link.source.depth) - (25)*(link.target.depth);
        return dist;
      })
      .friction(.8)
      .gravity(0.05)
      .size([w, h - 160]);


  function zoomed() {
    node.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    title.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    link.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  update(force, nodes, links);

}

function getRadius(node)
{
  return 40 - (node.depth.valueOf() * 10);
}

function update(force, nodes, links, link) {

  // Restart the force layout.
  force
    .nodes(nodes)
    .links(links)
    .start();

}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  title.attr("x", function(d){ return d.x;});
  title.attr("y", function(d) {return d.y; });
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
    switch(d.group){

    case 'Root':
      return '#cccccc';
      break;

    case 'A':
      return '#108bef';
      break;

    case 'B':
      return '#0fef13';
      break;

    case 'C':
      return '#ef380f';
      break;

    case 'D':
      return '#c935f2';
      break;
    }
}

// Toggle children on click.
function click(d) {
  alert(d.name);
  //update();
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}
