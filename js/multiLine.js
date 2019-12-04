// set the dimensions and lineMargins of the graph
let lineMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  chartWidth = 800 - lineMargin.left - lineMargin.right,
  chartHeight = 500 - lineMargin.top - lineMargin.bottom;

const lines = []

// append the svg object to the body of the page
const obstaclesChart = d3.select("#obstaclesChart")
  .append("svg")
  .attr("width", chartWidth + lineMargin.left + lineMargin.right)
  .attr("height", chartHeight + lineMargin.top + lineMargin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + lineMargin.left + "," + lineMargin.top + ")");

//Read the data
d3.csv("data/odf.csv", function (data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.obstacle; })
    .entries(data);

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year; }))
    .range([0, chartWidth]);
  obstaclesChart.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x).ticks(11).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.count; })])
    .range([chartHeight, 0]);
  obstaclesChart.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const res = sumstat.map(function (d) { return d.key }) // list of group names
  const color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])

  // Draw the line
  obstaclesChart.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function (d) { return color(d.key) })
    .attr("stroke-width", function (d) { return 3; })
    .attr("stroke-chartWidth", 1.5)
    .attr("d", function (d) {
      lines.push(this);
      return d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(+d.count); })
        (d.values)
    })


  //legend buttons

  //make a button for each line in the graph
  const buttons = [];
  lines.forEach((line, index) => {
    let button = $('#obstaclesButtons').append(`<button id="obsButton${index}" class="button obsButton">${lines[index].__data__.key}</button>`);
    buttons.push(button);
  });

  $('.obsButton').click( (event) => {
    //reset everything first
    //todo: set each button's background to the corresponding line's color?
    for (let i = 0; i < lines.length; i++) {
      d3.select(lines[i]).style("stroke-width", "3");
      $('.obsButton').css('background', '#f7f6f1');
    }

    $(event.target).css('background', '#c9a111');

    //match clicked  button with corresponding line
    let targetIndex = $(event.target).attr('id').slice(9);
    d3.select(lines[targetIndex]).style("stroke-width", "11");
  });

})
