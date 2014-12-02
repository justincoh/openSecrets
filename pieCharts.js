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
    .value(function(d) { return d.total; });


function createPieChart(data){

  var sum=0; //for calculating percentages below
  for(var i = 0; i<data.length;i++){
    sum += data[i]['total'];
  //Or should I store this as a key of the obj?
  }


  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    // console.log("SVG: ",Object.keys(svg[0][0]).sort())

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
      .text(function(d) { return d.data.industry; });


  var tooltip = d3.select('body').append('div')
          .style('position', 'absolute')
          .style('padding', '0 10px')
          .style('background', 'black')
          .style('color','white')
          .style('opacity', 0) // setting to 0 because we dont want it to show when the graphic first loads

      d3.selectAll('path').on('mouseover', function(d) {
        // console.log('D ',d)
        d3.select(this)
          .style('opacity', 0.5)
        tooltip.transition()
          .style('opacity', .9)
        tooltip.html(((d['value']/sum)*100).toFixed(2)+'%')
          // console.log(d)
          .style('left', (d3.event.pageX -15) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      })
        .on('mouseout', function(d) {
            d3.select(this)
              .style('opacity', 1)
            tooltip.transition()
              .style('opacity', 0)
        })


// });
}

// module.exports = createPieChart;