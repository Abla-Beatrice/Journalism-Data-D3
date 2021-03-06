
// Define SVG 
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Initialize global variables 
var chosenXaxis = 'poverty';
var chosenYaxis = 'healthcare';
var xlabel = 'Poverty: '
var ylabel = 'Lacks Healthcare: '

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Define a function that adjusts the scale of the x-axis based on the chosen x variable
function xScale(data, xAxis) {

  // create and return the new scale for the x-axis
  var xLinearScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([d3.min(data, d => d[xAxis]) * 0.9, d3.max(data, d => d[xAxis]) * 1.1]);
  return xLinearScale;
}

// Define a function that adjusts the scale of the y-axis based on the chosen y variable
function yScale(data, yAxis) {

  // create and return the new scale for the y-axis
  var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([d3.min(data, d => d[yAxis]) * 0.8, d3.max(data, d => d[yAxis]) * 1.1]);
  return yLinearScale;
}

// Define a function that moves the nodes 
function renderNodes(newXscale, newYscale, nodes) {
  nodes.transition()
    .duration(1000)
    .attr('transform', d => {
      d.x = newXscale(d[chosenXaxis]),
        d.y = newYscale(d[chosenYaxis]);
      return `translate(${d.x},${d.y})`;
    });

  // return the newly positioned nodes
  return nodes;
}

// Define a function to draw the new x-axis based on the user choosing a new variable for the axis
function renderxAxis(newXscale, xAxis) {

  // create the new x-axis based on the newXscale
  var bottomAxis = d3.axisBottom(newXscale);

  // transition the old x-axis to the new one dynamically
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  // return the new x-axis
  return xAxis;
}

// Define a function to draw the new y-axis based on the user choosing a new variable for the axis
function renderyAxis(newYscale, yAxis) {

  // create the new y-axis based on the newYscale
  var leftAxis = d3.axisLeft(newYscale);

  // transition the old y-axis to the new one dynamically
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  // return the new y-axis  
  return yAxis;
}

// Select scatter id, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import the data from the file 
d3.csv("assets/data/data.csv").then(csvData => {
  // Print the imported data
  console.log(csvData);

  // Cast the data values to a number
  csvData.forEach(healthData => {
    healthData.poverty = +healthData.poverty;
    healthData.healthcare = +healthData.healthcare;
    healthData.age = +healthData.age;
    healthData.obesity = +healthData.obesity;
    healthData.smokes = +healthData.smokes;
    healthData.income = +healthData.income;
  });


  // get the scales for the x- & y-axis by calling the appropriate function
  var xLinearScale = xScale(csvData, chosenXaxis);
  var yLinearScale = yScale(csvData, chosenYaxis);

  // Create two new functions passing the scales
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x-axis to the initial chart
  var xAxis = chartGroup.append("g")
    .classed('x-axis', true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // create text label group for the x-axis
  var xlabelsGroup = chartGroup.append('g')
    .attr("transform",
      "translate(" + (chartWidth / 2) + " ," +
      (chartHeight + margin.top - 10) + ")")

  var povertyLabel = xlabelsGroup.append("text")
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty')
    .classed('active', true)
    .text("In Poverty (%)");

  // create the second available label for the x-axis
  // (this will initialize to inactive, but will be available for the user to choose)
  var ageLabel = xlabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'age')
    .classed('inactive', true)
    .text('Age (Median)');

  // create the third available label for the x-axis
  var incomeLabel = xlabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'income')
    .classed('inactive', true)
    .text('Household Income (Median)');

  // append y-axis to the initial chart
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // create text label group for the y-axis
  var ylabelsGroup = chartGroup.append('g')
    .attr("transform", "rotate(-90)");

  // create the first available label for the y-axis
  var healthLabel = ylabelsGroup.append("text")
    .attr("y", 0 - (margin.left / 2))
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr('value', 'healthcare')
    .classed('active', true)
    .text("Lacks Healthcare (%)");

  // create the second available label for the y-axis
  var smokeLabel = ylabelsGroup.append("text")
    .attr("y", 0 - (margin.left / 2) - 10)
    .attr("x", 0 - (chartHeight / 2))
    .attr('value', 'smokes')
    .classed('inactive', true)
    .text("Smokes (%)");

  // create the third available label for the y-axis
  var obeseLabel = ylabelsGroup.append("text")
    .attr("y", 0 - (margin.left / 2) - 35)
    .attr("x", 0 - (chartHeight / 2))
    .attr('value', 'obesity')
    .classed('inactive', true)
    .text("Obese (%)");

  xlabelsGroup.selectAll('text').on('click', function () {
    // gets the value of the chosen variable
    var clicked = d3.select(this).attr('value');

    // checks to see if the user selection is different than the currently chosen variable
    if (clicked != chosenXaxis) {

      // sets the x-axis to the newly chosen variable
      chosenXaxis = clicked;

      // sets the new x-axis scale for the newly chosen variable
      xLinearScale = xScale(csvData, chosenXaxis);

      // creates the new x-axis for the newly chosen variable
      xAxis = renderxAxis(xLinearScale, xAxis);

      nodes = renderNodes(xLinearScale, yLinearScale, nodes);

      // sets the x-axis labels to active or inactive
      if (chosenXaxis === 'poverty') {
        povertyLabel.classed('active', true);
        povertyLabel.classed('inactive', false);
        ageLabel.classed('active', false);
        ageLabel.classed('inactive', true);
        incomeLabel.classed('active', false);
        incomeLabel.classed('inactive', true);
        
        xlabel = 'Poverty: '
      }
      else if (chosenXaxis === 'age') {
        povertyLabel.classed('active', false);
        povertyLabel.classed('inactive', true);
        ageLabel.classed('active', true);
        ageLabel.classed('inactive', false);
        incomeLabel.classed('active', false);
        incomeLabel.classed('inactive', true);
        
        xlabel = 'Age: '
      }
      else if (chosenXaxis === 'income') {
        povertyLabel.classed('active', false);
        povertyLabel.classed('inactive', true);
        ageLabel.classed('active', false);
        ageLabel.classed('inactive', true);
        incomeLabel.classed('active', true);
        incomeLabel.classed('inactive', false);
      
        xlabel = 'Income: '
      }
    } 
  }); 

  // Listener for the y-axis
  ylabelsGroup.selectAll('text').on('click', function () {

    // gets the value of the chosen variable
    var clicked = d3.select(this).attr('value');

    // checks to see if the user selection is different than the currently chosen variable
    if (clicked != chosenYaxis) {

      // sets the y-axis to the newly chosen variable
      chosenYaxis = clicked;

      // sets the new y-axis scale for the newly chosen variable
      yLinearScale = yScale(csvData, chosenYaxis);

      // creates the new y-axis for the newly chosen variable
      yAxis = renderyAxis(yLinearScale, yAxis);
      
      nodes = renderNodes(xLinearScale, yLinearScale, nodes);

      // sets the y-axis labels to active (chosen variable) or inactive (not chosen)
      if (chosenYaxis === 'obesity') {
        obeseLabel.classed('active', true);
        obeseLabel.classed('inactive', false);
        smokeLabel.classed('active', false);
        smokeLabel.classed('inactive', true);
        healthLabel.classed('active', false);
        healthLabel.classed('inactive', true);
        // set the new label for the tool tip
        ylabel = 'Obesity: '
      }
      else if (chosenYaxis === 'smokes') {
        obeseLabel.classed('active', false);
        obeseLabel.classed('inactive', true);
        smokeLabel.classed('active', true);
        smokeLabel.classed('inactive', false);
        healthLabel.classed('active', false);
        healthLabel.classed('inactive', true);
        // set the new label for the tool tip
        ylabel = 'Smokes: '
      }
      else if (chosenYaxis === 'healthcare') {
        obeseLabel.classed('active', false);
        obeseLabel.classed('inactive', true);
        smokeLabel.classed('active', false);
        smokeLabel.classed('inactive', true);
        healthLabel.classed('active', true);
        healthLabel.classed('inactive', false);
        // set the new label for the tool tip
        ylabel = 'Lacks Healthcare: '
      }
    }  
  }); 

  // create a group for each state data value
  var nodes = chartGroup.append("g")
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(csvData)
    .enter()
    .append("g")
    .attr('transform', d => {
      d.x = xLinearScale(d[chosenXaxis]),
        d.y = yLinearScale(d[chosenYaxis]);
      return `translate(${d.x},${d.y})`;
    })

  // add the circle to the node group to represent the data point
  nodes.append('circle')
    .attr('class', 'node')
    .attr("r", "10")
    .attr("fill", "#4b97c9")
    .attr("stroke-width", "1")
    .attr("stroke", "#4b97c9")

  // add the state abbreviation label to the node group for the data point
  nodes.append('text')
    .attr("x", 0)
    .attr("dy", ".35em")
    .attr('text-anchor', "middle")
    .text(d => { return d.abbr; })
    .attr("font_family", "sans-serif") 
    .attr("font-size", "11px")  
    .attr("fill", "white");   


  // create the tool tip for each node based on the current variable selections
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80, -60])
    .html(d => {
      return `${d.state}<br>${xlabel}${d[chosenXaxis]}<br>${ylabel}${d[chosenYaxis]}`;
    });

  nodes.call(toolTip);

  // tool tip listener
  nodes.on('mouseover', d => { toolTip.show(d) })
    .on('mouseout', d => { toolTip.hide(d) });

}); 