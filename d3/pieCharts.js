// var express = require('express');

var width = 600,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20()
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 15)
    .innerRadius(radius*.4);

var transitionArc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius*.5);


var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.total; });

var sum=0; //Will be used throughout this file

function createPieChart(data){


  for(var i = 0; i<data.length;i++){
    sum += data[i]['total'];
  //Or should I store this as a key of the obj?
  }


  var svg = d3.select("#repPieChart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    // console.log("SVG: ",Object.keys(svg[0][0]).sort())

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")


  g.append("path")
      .attr("d", arc)
      .attr("funding",function(d){return d.data.total})
      .style("fill", function(d) {
      	// console.log(d.data.age,": Start Angle , ",d.startAngle)  //Getting angles for each arc (in radians)
      	// console.log(d.data.age,": End Angle , ",d.endAngle)  //Getting angles for each arc
      	return color(d.data.industry); });


  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      // .style("z-index", "100") //
      .text(function(d) { return d.data.industry; });


    var element = d3.selectAll('svg')
    element = element[0][0];
    var bbox = element.getBBox();
          d3.selectAll('path').on('click', function(d) {
            pieSliceToggle(this);
            populateSummary();  //populating summary

          })
            .on('mouseover', function(d) {
                d3.select(this)
                  .style('opacity', 1)
            })
            .on('mouseout', function(d) {
                d3.select(this)
                  .style('opacity', .5)
            })
}

////Pie Chart Transitions
////Pop in and out on click
function pieSliceToggle(element){
  var thisPath = d3.select(element);
    if(thisPath.attr('active')==='true'){
      thisPath.transition().ease('elastic').duration(1000).attr('d', arc)
      thisPath.attr('active',false)
    } else {
      thisPath.transition().ease('back').duration(500).attr('d', transitionArc)
      thisPath.attr('active',true)
    }
};


//Formatting money for display purposes
function formatMoney (num) {
    return '$'+num.toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

////JQuery function that is called on every click to populate financial summary
////on the side of the page
function populateSummary(){
  var activeTotal=0;
  var $percentage = $('#percentage');
  var $summary = $('#summary');
  var $totalContributions = $("#totalContributions")
  var $activeNodes = $('path[active="true"]');
  var industries=[];
  
  $activeNodes.each(function(index,val){
    activeTotal+= +$(val).attr('funding');
    industries.push($(val).next().text());
  });
  var percent = +(activeTotal*100/sum).toFixed(2);
  // console.log(activeTotal,sum,percent,industries)
  var percentLi=$('<li/>')
    .html("<p>Percent of Total</p><h5>" + percent + "%" + "</h5>");
  var totalLi=$('<li/>')
    .html("<p>Selected Funding</p><h5>" + formatMoney(activeTotal) + "</h5>");
  
  $summary.html(industries.join('<br>'));
  $totalContributions.html(totalLi);
  // totalLi.appendTo($totalContributions);
  $percentage.html(percentLi);
  // percentLi.replaceWith($percentage);

}


// module.exports = createPieChart;
