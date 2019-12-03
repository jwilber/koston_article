// set the dimensions and marginss of the graph
const margins = {top: 30, right: 0, bottom: 30, left: 50},
    widths = 210 - margins.left - margins.right,
    heights = 210 - margins.top - margins.bottom;

//Read the data
d3.csv("data/odf.csv", function(data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.obstacle;})
    .entries(data);

  console.log('sumstat', sumstat)

  // What is the list of groups?
  allKeys = sumstat.map(function(d){return d.key})
  console.log('keys', allKeys)

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  const svg = d3.select("#multiples")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
    .append("svg")
      .attr("width", widths + margins.left + margins.right)
      .attr("height", heights + margins.top + margins.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margins.left + "," + margins.top + ")");

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return new Date(parseInt(d.year),0); }))
    .range([ 0, widths ]);
  svg
    .append("g")
    .attr("transform", "translate(0," + heights + ")")
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)));

  //Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.count; })])
    .range([ heights, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5));

  // Draw the line
  svg
    .append("path")
      .attr("fill", "none")
      .style('stroke', '#c9a111')
      .attr("stroke-width", '5px')
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(+d.year); })
          .y(function(d) { return y(+d.count); })
          (d.values)
      })

  // Add titles
  svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function(d){ return(d.key)})
    .style('font-family', "LeagueGothicRegular")
    .style('font-size', '1.3rem')

})