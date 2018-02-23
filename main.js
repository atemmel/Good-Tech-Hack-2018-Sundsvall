function generateNodes()
{
  var main = document.getElementById('main');

  var out = '<polyline class="binding" points="200,50 700,100" style="fill:none; stroke:black; stroke-width:4"/>';
  out += '<circle class="node" id="nodeA" cx="200" cy="50" r="40" stroke="gray" stroke-width="4" fill="white"/>';
  out += '<text x="200" y="50" text-anchor="middle" fill="blue" dy="0em"> <tspan x="200" dy="0em"> rad 1 jao </tspan> <tspan x="200" dy="1em"> rad 2 ??? </tspan></text>';
  out += '<circle class="node" id="nodeB" cx="700" cy="100" r="20" stroke="gray" stroke-width="4" fill="white" />';

  main.innerHTML = out;
}
