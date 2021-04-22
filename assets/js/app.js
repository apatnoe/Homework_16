// @TODO: YOUR CODE HERE!

var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
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

// // Initial Params
// var chosenXAxis = "hair_length";

// // function used for updating x-scale var upon click on axis label
// function xScale(censusData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
//       d3.max(censusData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }

// function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "hair_length") {
//     label = "Hair Length:";
//   }
//   else {
//     label = "# of Albums:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

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
  .range([0, height]);

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
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", 10)
    .attr("fill", "#ADD8E6")
    .style("stroke", "#DCDCDC") 
    .attr("text", d => d.abbr);

  circlesGroup.append("text")
    .text(function(d){return d.abbr})
    .attr({
      "text-anchor": "middle",
    });

    // append x axis
  chartGroup.append("text")
    .attr("x",(width/3))
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

  }
);

