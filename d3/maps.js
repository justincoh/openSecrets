var drawMap = function(heatMapObject) {
    var width = 750,
        height = 500;

    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);


    d3.selectAll('svg').remove();
    var svg = d3.select(".mapContainer").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", 'US')

    //pulling in state json data
    d3.json("/d3/us.json", function(error, us) {
        if (error) return console.error(error);

        svg.append("path")
            .datum(topojson.feature(us, us.objects.subunits))
            .attr("d", path);

        svg.selectAll(".subunit")
            .data(topojson.feature(us, us.objects.subunits).features)
            .enter().append("path")
            .attr("class", function(d) {
                return "subunit " + d.id;
            })
            //added id in above line to use as selector: ex US-NY
            .attr("d", path)

        ////Gives state boundary lines
        svg.insert('path', '.graticule')
            .datum(topojson.feature(us, us.objects.subunits, function(a, b) {
                return a !== b;
            }))
            .attr('class', 'state-boundary')
            .attr("d", path);

        //tooltip template
        var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'black')
            .style('color', 'white')
            .style('opacity', 0)
            .style('font-size', '1.25rem')

        //HeatMap
        if (heatMapObject) {
            var stateHeat = heatMapObject;
            var paths = d3.selectAll('path')[0];
            paths.forEach(function(path) {
                
                var classString = path.className.animVal;
                var state = classString.slice(classString.length - 2);
                if (typeof stateHeat[state] === 'undefined') {  
                    //states with no returned entries
                    stateHeat[state] = 0;
                }
            })

            //getting top total
            var orderedKeys = Object.keys(heatMapObject).sort(function(a,b){
                return heatMapObject[b] - heatMapObject[a]})
            var topState = orderedKeys[0];
            var topTotal = heatMapObject[topState];

            var colorFunc = d3.scale.linear()
                .domain([0, topTotal / 2, topTotal])
                .range(['#4C4C4C', '#0b24e5', '#e50b24']);

            svg.selectAll(".subunit")
                .style('fill', function(d) {
                    var abbrev = d.id.split('-').pop();
                    return colorFunc(stateHeat[abbrev])
                })
                .style('opacity', .8)

            //HeatMap Specific Tooltip
            d3.selectAll('.subunit')
                .on('mouseover', function(d) {
                    var stateId = d.id.slice(d.id.length - 2);
                    var funding = formatMoney(stateHeat[stateId]);

                    d3.select(this).style('opacity', 0.7)
                    tooltip.transition()
                        .style('opacity', .9)
                    tooltip.html([stateId, funding].join(': '))
                        .style('left', (d3.event.pageX - 15) + 'px')
                        .style('top', (d3.event.pageY - 30) + 'px')
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('opacity', .8)
                    tooltip.transition().duration(500)
                        .style('opacity', 0)
                })
                .on('click', function(d) {
                    var stateAbbrev = d.id.split('-')[1];
                    window.location.replace('/state/' + stateAbbrev);
                })

        }


        //Hover tooltip
        else if (!heatMapObject) {

            d3.selectAll('path')
                .on('mouseover', function(d) {

                    if (d3.select(this).attr('class') === 'state-boundary') {
                        return; //Handles mouseover state boundary lines
                    }
                    var stateAbbrev = d.id.split('-')[1];

                    d3.select(this)
                        .style('opacity', 0.7)
                    tooltip.transition()
                        .style('opacity', .9)
                    tooltip.html(stateAbbrev)
                        .style('left', (d3.event.pageX - 15) + 'px')
                        .style('top', (d3.event.pageY - 30) + 'px')
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('opacity', .5)
                    tooltip.transition().duration(500)
                        .style('opacity', 0)
                })
                .on('click', function(d) {
                    var stateAbbrev = d.id.split('-')[1];
                    window.location.replace('/state/' + stateAbbrev);
                })
        }


    });
};

drawMap();


//Formatting money for display purposes
function formatMoney(num) {
    return '$' + num.toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}


$(".dropdown-button").dropdown();
var heatMapHandler = function(industryNameString) {
    var industry = industryNameString;
    var dropdown = $('#industry-dropdown');
    dropdown.on('click', function(e) {
        var industry = $(e.target).text();
        var industryForDisplay = industry;
        //handling '&' characters
        if (industry.indexOf('&') !== -1) {
            var industryForDisplay = industry;
            industry = industry.replace('&', 'REPLACED')
        }

        $.get('/heatMaps/?' + industry, function(data) {
            var total = 0;
            for(state in data){
                if(data.hasOwnProperty(state)){
                    total+=data[state]
                }
            }
            drawMap(data)
            $("#summary").empty();
            $("#summary").append("<div id='legend-wrapper'><div class='col center-align' id='legend'><div class='least'>$0</div><div class='most'>$$$</div><div class='colors'><div class='color-panel' style='background-color: #4C4C4C;'></div><div class='color-panel' style='background-color: #0b24e5;'></div><div class='color-panel' style='background-color: #6034A2;'></div><div class='color-panel' style='background-color: #852F81;'></div><div class='color-panel' style='background-color: #e50b24;'></div></div></div></div><br>")
            $("#summary").append('<br><p id="heatmap-summary"><h5>' + industryForDisplay + '</h5><hr>' + formatMoney(total) + ' in total funding</p>');
        })
    })
}

heatMapHandler();


