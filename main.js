function generateNodes()
{
  var main = document.getElementById('main');

  var out = '<polyline class="binding" points="200,50 700,100" style="fill:none; stroke:black; stroke-width:4"/>';

  out += createNode(200, 50, 40, "Bubbla a");
  //out += createText(200, 50, "rad 1 jao");
  out += createNode(700, 100, 20, "Bubbla b");

  main.innerHTML = out;
}

function createNode(x, y, radius, string)
{
  return '<circle class="node" cx="' + x +'" cy="'+ y + '" r="' + radius + '" stroke="gray" stroke-width="4" fill="white"/>' +
  '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="blue" dy="0.314em" font-size="' + radius/2 +'">' + string + '</text>';
}

function createText(x, y, string)
{
  return '<text x="' + x + '" y="' + y + '" text-anchor="middle" fill="blue" dy="0em"> <tspan x="' + x + '" dy="0.314em">' + string + '</tspan> </text>';
}
