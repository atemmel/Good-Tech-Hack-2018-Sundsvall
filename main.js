let color_node_outline  = '#7f8c8d';
let color_node_text     = '#ecf0f1';

let color_binding       = '#7f8c8d';

var link, node, title, w = window.outerWidth, h = window.outerHeight ;
let rad = 50;

var halfw = w/2;
var halfh = h/2;

var scale = 1;

var following = null;
var root;

function generateNodes()
{

  var words = [
    {
        "depth":"0",
        "group":"Root",
		"description":"Det här är en bil som skall ha hög kvalité, vara bränslesnål och ha låga utsläpp. Säkerheten och designen är viktiga aspekter.",
        "name":"Bil Model Deluxe",
        "children":[
            {
                "depth":"1",
                "group":"A",
				"description": "En krockkudde för ökad säkerhet i bilen",
                "name":"[Koncept]\nKrockkudde"
            },
            {
                "depth":"1",
                "group":"B",
				"description": "Bilen behöver en motor, vi har kommit fram till att testa tre alternativ: Diesel-, bensin- och elmotorer.",
                "name":"[Koncept]\nMotor",
                "children":[
                    {
                        "depth":"2",
                        "group":"B",
						"description":"En prototyp för en dieselmotor byggdes och testades. Däremot så visade det sig att teamet som utvecklade elmotorn fick bättre resultat och vidare utveckling till produktion av diesel alternativet lades ned.",
                        "name": "[Prototyp]\nDiesel"
                    },
                    {
                        "depth":"2",
                        "group":"B",
						"description":"Vi lyckades göra ett flertal prototyper med olika strukturer, två av dessa prototyper visade sig vara mycket lovande för olika endamål. Vi har bestämt att dela vårat team i två och utveckla produkter utifrån dessa två prototyper.",
                        "name": "[Prototyp]\nEl",
                        "children":[
                            {
                                "depth":"3",
                                "group":"B",
								"description":"Motorn med högre top-rotation och vridmoment som fart-entusiaster kommer uppskatta.",
								"name": "[Produkt]\nVersion 1"
                            },
                            {
                                "depth":"3",
                                "group":"B",
								"description":"Den mer energisnåla men långsammare motorn som passar bättre för vardagsbruk eller längre färder så som i t.ex lastbilar.",
                                "name": "[Produkt]\nVersion 2"
                            }
                        ]
                    },
                    {
                        "depth":"2",
                        "group":"B",
						"description": "Vi byggde aldrig klart prototypen till bensinmotorn då vi insåg att datorsimuleringarna och uträkningarna vid utveklingen av motorn pekade på för höga utsläpp.",
                        "name":"[Prototyp]\nBensin"
                    }
                ]
            },
            {
                "depth":"1",
                "group":"C",
				"description":"Airkondition är nödvändigt för komfort, vi funderar på fläktbladsdesign för maximal prestanda och även luftfilter mot föroreningar som kan förekomma i storstäder.",
                "name":"[Koncept]\nAircondition"
            },
            {
                "depth":"1",
                "group":"D",
				"description":"Chassit måste vara stryktåligt",
                "name":"[Koncept]\nChassi",
                "children":[
                    {
                        "depth":"2",
                        "group":"D",
						"description":"Flygplans-gradig titan-legering, starkt och lätt, kan minska på utsläpp, däremot dyrt. Mer information om utsläpp vid tillverkning och pris behövs.",
                        "name":"[Protoyp]\nTitan-legering"
                    },
                    {
                        "depth":"2",
                        "group":"D",
						"description":"Experimentellt kompositmaterial. Mer forskning måste göras i hur vi ska forma och producera delar på ett kostnadseffektivt sett.",
                        "name":"[Prototyp]\nKomposit"
                    }
                ]
            }
        ]
    }
  ]

  /*var zoom = d3.behavior.zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", zoomed);*/

  var svg = d3.select("#main").append("svg")
  	.attr("width", "100%")
  	.attr("height", "100%")
    ;//.call(zoom);

  root = words[0]; //set root node
  root.fixed = true;
  root.x = w / 2;
  root.y = h / 2;

  var nodes = flatten(root),
  links = d3.layout.tree().links(nodes);

  // Update the links…
  link = svg.selectAll(".link")
    .data(links);

  // Enter any new links.

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
    .style("stroke-width", getOutline)
    .on("click", click);

    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .style("stroke", color_binding)
        .style("stroke-width", getLine);
    //.call(clicked);

    title = svg.selectAll("text.title")
         .data(nodes);

    // Enter any new titles.
    title.enter()
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .style("fill", color_node_text)
        .style("font-family", "Roboto, sans-serif")
        .style("paint-order", "stroke")
        .style("stroke", "#333333")
        .text(function(d) { return d.name; })
        .on("click", click)
        .style("stroke-width", function(d) {
          var radius = getRadius(d);
          return (Math.min(  radius, (radius - 1) / this.getComputedTextLength() * 30))/20 + "px"; })
        .style("font-size", function(d) {
          var radius = getRadius(d);
          return Math.min( radius, ( radius - 1) / this.getComputedTextLength() * 30 ) + "px"; });

    var force = d3.layout.force()
      .on("tick", tick)
      .charge(-700)
      .linkDistance(function(link){
        var dist = getLine(link);
        return (150*dist-120);
      })
      .friction(.8)
      .gravity(-0.01)
      .size([w, h]);


  function zoomed() {
    scale = d3.event.scale;
    node.transition()
    .duration(500).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    title.transition()
    .duration(500).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    link.transition()
    .duration(500).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  centerNode(root);

  update(force, nodes, links);

}

function getRadius(node)
{
  if(node.depth==0)
  {
    return 100;
  }
  else
  {
    return rad * (3/4)**(node.depth.valueOf());
  }
}

function getOutline(node)
{
  var kioskmongo = getRadius(node);
  kioskmongo /= 20;
  return kioskmongo;
}

function getLine(link)
{
  var width = getOutline(link.target);
  return width;
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
      return '#3498db';
      break;

    case 'B':
      return '#2ecc71';
      break;

    case 'C':
      return '#e74c3c';
      break;

    case 'D':
      return '#8e44ad';
      break;
    }
}

// Toggle children on click.
function click(d) {

  show(d);
  centerNode(d);
  //alert(d.name);
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

function centerNode(where){

  if(following == where)
  {
    where = root;

  }

  following = where;

  scale = (where.depth * 1.75) + 1;

  x = (halfw  - where.x* scale) ;
  y = (halfh - where.y* scale);

  node.transition()
  .duration(500)
  .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
  title.transition()
  .duration(500)
  .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
  link.transition()
  .duration(500)
  .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
}

function show(d)
{
  var box = document.getElementById('messagebox');

  if(d == root || d == following) {
    box.style.opacity = 0;
    return;
  }
  else {
    box.style.opacity = 1;
  }

  box.innerHTML = '<div>' + d.description + '</div><div id="takeMeToChurch">Till trådar</div><div id="weBuiltThisCity">Bygg vidare</div>';
}
