// set the dimensions and lineMargins of the graph
let lineMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  chartWidth = 800 - lineMargin.left - lineMargin.right,
  chartHeight = 500 - lineMargin.top - lineMargin.bottom;

// append the svg object to the body of the page
const obstaclesChart = d3.select("#obstacles")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${(chartWidth + lineMargin.left + lineMargin.right)}
    ${(chartHeight + lineMargin.top + lineMargin.bottom)}`)
  .append("g")
  .attr("transform",
    "translate(" + lineMargin.left + "," + lineMargin.top + ")");

//Read the data
d3.csv("data/perc_df.csv", function (data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(d => d.obstacle)
    .entries(data);

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, chartWidth]);
  obstaclesChart.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x).ticks(11).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3.scaleLinear()
    // .domain([0, d3.max(data, d => +d.count)])
    .domain([-0.1, 65])
    .range([chartHeight, 0]);
  obstaclesChart.append("g")
    .call(d3.axisLeft(y));

  const keys = sumstat.map(d => d.key[0].toUpperCase() + d.key.slice(1))

  // color palette
  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#c9a111', 'grey', 'brown'])


  // Draw the line
  obstaclesChart.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", d => color(d.key))
    .attr("stroke-width", d => 12)
    .attr("stroke-chartWidth", 1.5)
    .attr("d", function (d) {
      return d3.line()
        .x(d => x(d.year))
        .y(d => y(+d.count))
        // .curve(d3.curveCardinal.tension(1.5))
        (d.values)
    });

  // Add one dot in the legend for each key
  obstaclesChart.selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", chartWidth - chartWidth/5)
    .attr("y", function (d, i) { return 100 + i * 25 })
    .attr("width", 15)
    .attr("height", 10)
    .style("fill", function (d) { return color(d) })

  console.log('SUMSTAT', sumstat)

  // Add the keys 
  obstaclesChart.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", chartWidth - chartWidth/5.8)
    .attr("y", function (d, i) { return 100 + i * 23 })
    .style("fill", function (d) { return color(d) })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

})
