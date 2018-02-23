let color_node_fill     = '#444444';
let color_node_outline  = '#666666';
let color_node_text     = '#DDDDDD';

let color_binding       = '#666666';

function generateNodes()
{
  var main = document.getElementById('main');

  var x = 200;
  var y = 0;
  var rad = 80;

  var out ;
  for (var i = 0; i<6; i++)
  {
    x *= (2/3)^(i);
    y += 50;
    rad *= (2/3);
    out += '<polyline class="binding" points="'+ x + ','+ y +' '+ (x+x*(2/3)^(i+1)) + ',' + (y+50) + '" style="fill:none; stroke:' + color_binding + '; stroke-width:' + rad/10 + '"/>';
    //out += createNode(x, y , rad, "Bubbla " + i);
  }

  var x = 200;
  var y = 0;
  var rad = 80;

  for (var i = 0; i<7; i++)
  {
    x *= (2/3)^(i);
    y += 50;
    rad *= (2/3);
    out += createNode(x, y , rad, "Bubbla " + i);
  }
  /*var out = '<polyline class="binding" points="200,50 700,100" style="fill:none; stroke:' + color_binding + '; stroke-width:4"/>';

  out += createNode(200, 50, 40, "Bubbla a");
  out += createNode(700, 100, 20, "Bubbla b");*/

  main.innerHTML = out;
}

function createNode(x, y, radius, string)
{
  return '<circle class="node" cx="' + x +'" cy="'+ y + '" r="' + radius + '" stroke="' + color_node_outline + '" stroke-width="' + radius/10 + '" fill="' +
  color_node_fill +'"/>' + '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="' + color_node_text +'" dy="0.314em" font-size="' + radius/2 +'">' + string + '</text>';
}
