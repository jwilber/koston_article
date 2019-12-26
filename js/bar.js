// set the dimensions and margins of the graph
const smallBarMargin = { top: 40, right: 30, bottom: 40, left: 100 };
  smallBarWidth = 200 - smallBarMargin.left - smallBarMargin.right,
  smallBarHeight = 200 - smallBarMargin.top - smallBarMargin.bottom;

let barplot = function (dataSource, data) {

  // add svg
  let svg = d3.select(`#${dataSource.div}`)
    .append("svg")
    .attr("id", `svg${dataSource.div}`)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${(smallBarWidth + smallBarMargin.left + smallBarMargin.right)}
    ${(smallBarHeight + smallBarMargin.top + smallBarMargin.bottom)}`)
    .append("g")
    .attr("id", `g${dataSource.div}`)
    .attr("transform",
      "translate(" + smallBarMargin.left + "," + smallBarMargin.top + ")");

  let maxValue = d3.max(data, d => +d.count);
  console.log('maxValue', maxValue)
  // create x scale
  let x = d3.scaleLinear()
    .domain([0, 8])//d3.max(data, d => +d.count)])
    .range([0, smallBarWidth]);
  console.log('x', x.domain)

  // add x-axis to chart
  let xAxis = d3.axisBottom(x).tickSize(0).tickFormat(d3.format("d"));
  d3.select(`#g${dataSource.div}`).append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + smallBarHeight + ")")
    .style('font-size', ".4rem")
    .call(xAxis);

  // Y axis
  let y = d3.scaleBand()
    .range([0, smallBarHeight])
    .domain(data.map(function (d) { return d.trick; }))
    .padding(.55);

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", ".7rem")

  // add bars
  d3.select(`#g${dataSource.div}`).selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.trick); })
    .attr("width", function (d) { return x(d.count); })
    .attr("height", y.bandwidth())
    .attr('fill', "#c9a111")
    .style('stroke', '#c9a111')
    .style('stroke-width', 7)

  // add title
  d3.select(`#svg${dataSource.div}`)
    .append('text')
    .attr('x', smallBarWidth)
    .attr('y', smallBarMargin.top)
    .html(`${dataSource.subset}`)
    .style('font-family', "LeagueGothicRegular")
    .style('font-size', '1.3rem')
}

barDict = [
  { 'div': 'bar1', 'subset': 'flat' },
  { 'div': 'bar2', 'subset': 'ledge' },
  { 'div': 'bar3', 'subset': 'gaps' },
  { 'div': 'bar4', 'subset': 'rail' },
  { 'div': 'bar5', 'subset': 'transition' },
];

d3.csv("data/counts_by_obstacle.csv", data => {

  barDict.forEach(d => {
    let obstacleData = data.filter(val => {
      return val.obstacle === d.subset;
    });

    console.log(obstacleData)

    // create barplot for each subset of data  
    barplot(d, obstacleData);
  });

});
