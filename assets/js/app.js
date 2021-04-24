// @TODO: YOUR CODE HERE!

var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("/assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcareLow = +data.healthcareLow;
  });

  console.log(censusData)

  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(censusData, d => d.poverty)-1, d3.max(censusData, d => d.poverty)+2])
  .range([0, width]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcareLow)-1, d3.max(censusData, d => d.healthcareLow)+4])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.append("g").selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", 10)
    .classed("stateCircle", true); 

  var statesGroup = chartGroup.append("g").selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcareLow)+3)
    .text(d => d.abbr)
    .style("font", "10px times")
    .classed("stateText", true)
    .attr("text-anchor","middle");

    // append x axis
  chartGroup.append("text")
    .attr("x",(width/2))
    .attr("y", height + 40)
    .attr("dy", "1em")
    .attr("font-weight", 700)
    .style("text-anchor", "middle")
    .classed("axis-text", true)
    .text("In Poverty (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-weight", 700)
    .style("text-anchor", "middle")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

}).catch(function(error) {
  console.log(error);
});

