var apiKey = '464d93f237b44d62ce46382d060a193b';

var width = 800,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);


var svg = d3.select(".mapContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id",'US')


d3.json("/d3/us.json", function(error, us) {
  if (error) return console.error(error);

  svg.append("path")
      .datum(topojson.feature(us, us.objects.subunits))
      .attr("d", path);

  svg.selectAll(".subunit")
      .data(topojson.feature(us, us.objects.subunits).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; }) 
      //added id in above line to use as selector: ex US-NY
      .attr("d", path)
      

  /////////Gives state boundary lines
  svg.insert('path','.graticule')
    .datum(topojson.feature(us, us.objects.subunits,function(a, b) {console.log(a,b); return a !== b; }))
    .attr('class','state-boundary')
    .attr("d", path);

    //Building hover tooltip
    //has to be inside d3.json build for async reasons
  var tooltip = d3.select('body').append('div')
              .style('position', 'absolute')
              .style('padding', '0 10px')
              .style('background', 'black')
              .style('color','white')
              .style('opacity', 0) // setting to 0 because we dont want it to show when the graphic first loads

      d3.selectAll('path')
        .on('mouseover', function(d) {
          
          if(d3.select(this).attr('class')==='state-boundary'){
            return;  //Handles mouseover state boundary lines
          }
        var stateAbbrev = d.id.split('-')[1];
      
        d3.select(this)
          .style('opacity', 0.7)
        tooltip.transition()
          .style('opacity', .9)
        tooltip.html(stateAbbrev)
          .style('left', (d3.event.pageX -15) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      })
      .on('mouseout', function(d) {
            d3.select(this)
              .style('opacity', .5)
            tooltip.transition().duration(500)
              .style('opacity', 0)
      })
      .on('click',function(d) {
        var stateAbbrev = d.id.split('-')[1];
        d3.select(this)
        // window.location.replace('http://localhost:3000/state/'+stateAbbrev);
        window.location.replace('/state/'+stateAbbrev);
        console.log(this)
      })  


});            

