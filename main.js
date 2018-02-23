let color_node_fill     = '#444444';
let color_node_outline  = '#666666';
let color_node_text     = '#DDDDDD';

let color_binding       = '#666666';

var link, node, title;

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
                        "name":"J"
                    }
                ]
            }
        ]
    }
  ]


  var w = window.outerWidth,
  	h = window.outerHeight,
  	radius = 20,
  	root;

  var svg = d3.select("#main").append("svg")
  	.attr("width", w)
  	.attr("height", h);

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
    .on("click", click);
    //.call(clicked);



    title = svg.selectAll("text.title")
         .data(nodes);

    // Enter any new titles.
    title.enter()
        .append("text")
        .attr("class", "title")
        .style("fill", color_node_text)
        .style("font-family", "Roboto, sans-serif")
        .text(function(d) { return d.name; });

    // Exit any old titles.
    title.exit().remove();

    var force = d3.layout.force()
      .on("tick", tick)
      .charge(-500)
      .linkDistance(function(link){
        var dist = 150 - (25)*(link.source.depth) - (25)*(link.target.depth);
        console.log(dist);
        return dist;
      })
      .friction(.8)
      .gravity(0.05)
      .size([w, h - 160]);

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

  title.attr("transform", function(d){ return "translate("+(d.x + 20)+","+(d.y)+")"; });
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
