{

  let rangeMin = -100;
  let rangeMax = 100

  let std = 10

  let n = 1000,
    random = d3.random.normal(0, std),
    data = d3.range(n).map(random);

  let margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  let x = d3.scale.linear()
      .domain([0, n - 1])
      .range([0, width]);

  let y = d3.scale.linear()
      .domain([rangeMin, rangeMax])
      .range([height, 0]);

  let line = d3.svg.line()
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

  let chartId = document.currentScript.getAttribute('chartId')
  let svg = d3.select(`#${chartId}`).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));

  let path = svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  tick();

  function tick() {

    // push a new data point onto the back
    data.push(random());

    // redraw the line, and slide it to the left
    path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)")
        .each("end", tick);

    // pop the old data point off the front
    data.shift();

  }
}