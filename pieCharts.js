// var express = require('express');

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20()
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius*.4);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });


function createPieChart(data){
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    // console.log("SVG: ",Object.keys(svg[0][0]).sort())

// var data = [   //This was test data
// 	{age:'<5',population:270},
// 	{age:'5-13',population:449},
// 	{age:'14-17',population:215},
// 	{age:'Junk',population:300},
// 	{age:'More Junk',population:50}
// 	]

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { 
      	// console.log(d.data.age,": Start Angle , ",d.startAngle)  //Getting angles for each arc (in radians)
      	// console.log(d.data.age,": End Angle , ",d.endAngle)  //Getting angles for each arc
      	return color(d.data.industry); });


  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.age; });

// });
}

// module.exports = createPieChart;