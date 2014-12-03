// var express = require('express');

var width = 600,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20()
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
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
      .text(function(d) { return d.data.industry; });

  //For tooltip positioning, though you might want to remove tooltip entirely
  //and just have each click print things on the side in a list
  //but each path is going to need to have its associated data
    var element = d3.selectAll('svg')
    element = element[0][0];
    var bbox = element.getBBox();
    // var tooltip = d3.select('body').append('div')
    //           .style('position', 'absolute')
    //           .style('padding', '0 10px')
    //           .style('background', 'black')
    //           .style('color','white')
    //           .style('opacity', 0) // setting to 0 because we dont want it to show when the graphic first loads
    //           .style('font-size','12px')
          d3.selectAll('path').on('click', function(d) {
            pieSliceToggle(this);
            populateSummary();  //populating summary
            // tooltip.transition()
            //   .style('opacity', .9)
            // tooltip.html((
            //   (d['value']/sum)*100)
            //     .toFixed(2)+'% of total funding')
              // console.log(d)
              // .style('left', (d3.event.pageX -15) + 'px')
              // .style('top', (d3.event.pageY - 30) + 'px')
              // .style('left', (bbox.width*.5) + 'px')
              // .style('top', (bbox.height*.5) + 'px')

          })
            .on('mouseout', function(d) {
                d3.select(this)
                  .style('opacity', 1)
                // tooltip.transition()
                //   .style('opacity', 0)
            })
}

////Pie Chart Transitions
////Pop in and out on click
function pieSliceToggle(element){
  var thisPath = d3.select(element);
    if(thisPath.attr('active')==='true'){
      thisPath.transition().attr('d', arc)
      thisPath.attr('active',false)
    } else {
      thisPath.transition().attr('d', transitionArc)
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
////am going to have to refactor the HTML to make this layout work
function populateSummary(){
  var activeTotal=0;
  var $percentage = $('#percentage');
  var $summary = $('ul#summary');
  var $activeNodes = $('path[active="true"]');
  var industries=[];
  // activeNodes.each(function(index,val){console.log($(val).attr('funding'))})
  $activeNodes.each(function(index,val){
    activeTotal+= +$(val).attr('funding');
    industries.push($(val).next().text());
  });
  var percent = +(activeTotal*100/sum).toFixed(2);
  // console.log(activeTotal,sum,percent,industries)
  var percentLi=$('<li/>')
    .text(percent+'% of total funding for cycle:');
  var totalLi=$('<li/>')
    .text(formatMoney(activeTotal));


  console.log($percentage)
  $summary.text(industries.join(', '))
  totalLi.appendTo($summary);
  percentLi.appendTo($summary);

}


// module.exports = createPieChart;
