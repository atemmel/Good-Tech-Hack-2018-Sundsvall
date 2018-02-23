let color_node_fill     = '#444444';
let color_node_outline  = '#666666';
let color_node_text     = '#DDDDDD';

let color_binding       = '#666666';

function generateNodes()
{

  var words = [
    {
        "group":"0",
        "word":"Root",
        "children":[
            {
                "group":"1",
                "name":"A"
            },
            {
                "group":"1",
                "name":"B",
                "children":[
                    {
                        "group":"2",
                        "name": "C"
                    },
                    {
                        "group":"2",
                        "name": "D",
                        "children":[
                            {
                                "group":"3",
                                "name": "E"
                            },
                            {
                                "group":"3",
                                "name": "F"
                            }
                        ]
                    },
                    {
                        "group":"2",
                        "name":"G"
                    }
                ]
            },
            {
                "group":"1",
                "name":"H"
            },
            {
                "group":"1",
                "name":"I",
                "children":[
                    {
                        "group":"2",
                        "name":"J"
                    },
                    {
                        "group":"2",
                        "name":"K"
                    }
                ]
            }
        ]
    }
  ]

  var w = window.outerWidth,
  	h = window.outerHeight,
  	radius = 20,
  	node,
  	link,
  	root;

  var force = d3.layout.force()
  	.on("tick", tick)
  	.charge(-500)
  	.linkDistance(60)
    .friction(0.8)
    .gravity(-0.01)
  	.size([w, h - 160]);

  var svg = d3.select("#main").append("svg")
  	.attr("width", w)
  	.attr("height", h);

  root = words[0]; //set root node
  root.fixed = true;
  root.x = w / 2;
  root.y = h / 2 - 80;
  update();

  function update() {
  	var nodes = flatten(root),
  	links = d3.layout.tree().links(nodes);

  	// Restart the force layout.
  	force
  		.nodes(nodes)
  		.links(links)
  		.start();

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

  	// Exit any old links.
  	link.exit().remove();

  	// Update the nodes…
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
  		.on("click", click)
  		.call(force.drag);
  	// Exit any old nodes.
  	node.exit().remove();


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
      return 'rgb('+(d.group*30)+','+ (d.group*80)+','+ (d.group*80)+')';
  }

  // Toggle children on click.
  function click(d) {
  	/*if (d.children) {
  		d._children = d.children;
  		d.children = null;
  	} else {
  		d.children = d._children;
  		d._children = null;
  	}*/
    if(d.group == 0) return;
  	update();
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
}


function getRadius(node)
{
  return 40 - (node.group.valueOf() * 10);
}
