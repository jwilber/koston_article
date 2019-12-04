// set the dimensions and lineMargins of the graph
var lineMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  lineWidth = 800 - lineMargin.left - lineMargin.right,
  lineHeight = 500 - lineMargin.top - lineMargin.bottom;

// append the svg object to the body of the page
var obstaclesChart = d3.select("#obstacles")
  .append("svg")
  .attr("width", lineWidth + lineMargin.left + lineMargin.right)
  .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + lineMargin.left + "," + lineMargin.top + ")");

//Read the data
d3.csv("data/odf.csv", function (data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.obstacle; })
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year; }))
    .range([0, lineWidth]);
  obstaclesChart.append("g")
    .attr("transform", "translate(0," + lineHeight + ")")
    .call(d3.axisBottom(x).ticks(11));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.count; })])
    .range([lineHeight, 0]);
  obstaclesChart.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function (d) { return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])

  // Draw the line
  obstaclesChart.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d.key) })
    .attr("stroke-lineWidth", 1.5)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(+d.count); })
        (d.values)
    })
})