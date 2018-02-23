let color_node_fill     = '#444444';
let color_node_outline  = '#666666';
let color_node_text     = '#DDDDDD';

let color_binding       = '#666666';

function generateNodes()
{
  var main = document.getElementById('main');

  var out = '<polyline class="binding" points="200,50 700,100" style="fill:none; stroke:' + color_binding + '; stroke-width:4"/>';

  out += createNode(200, 50, 40, "Bubbla a");
  out += createNode(700, 100, 20, "Bubbla b");

  main.innerHTML = out;
}

function createNode(x, y, radius, string)
{
  return '<circle class="node" cx="' + x +'" cy="'+ y + '" r="' + radius + '" stroke="' + color_node_outline + '" stroke-width="4" fill="' +
  color_node_fill +'"/>' + '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + color_node_text +'" dy="0.314em" font-size="' + radius/2 +'">' + string + '</text>';
}
