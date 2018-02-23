function generateNodes()
{
  var main = document.getElementById('main');

  var out = '<polyline class="binding" points="200,50 700,100" style="fill:none; stroke:black; stroke-width:4"/>';
  
  out += createNode(200, 50, 40);
  out += createNode(700, 100, 20);

  main.innerHTML = out;
}

function createNode(x, y, radius)
{
  return '<circle class="node" cx="' + x +'" cy="'+ y + '" r="' + radius + '" stroke="gray" stroke-width="4" fill="white"/>';
}
