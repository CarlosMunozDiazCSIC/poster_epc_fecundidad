//EJECUCIÓN FUNCIONES
//initOverlayChart();

function initOverlayChart() {
    d3.csv('../data/incrementos.csv', function (error, data) {
        if (error) throw error;

        let margin = {top: 5, right: 5, bottom: 17.5, left: 30},
            width = document.getElementById('chart-overlay').clientWidth - margin.left - margin.right,
            height = 520 - margin.top - margin.bottom;

        let svg = d3.select("#chart-overlay")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data = data.reverse();

        let x = d3.scaleBand()
            .domain(data.map(function(d) { return d.Year; }))
            .range([ 0, width ])
            .paddingOuter(0);

        let xAxis = function(svg) {
            svg.call(d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%11)})));
            svg.call(function(g){g.select('.domain').remove()});
            svg.call(function(g){g.selectAll('line').remove()});
        } 
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        let y = d3.scaleLinear()
            .domain([0, 100])
            .range([ height, 0 ])
            .nice();

        let yAxis = function(svg) {
            svg.call(d3.axisLeft(y).ticks(5));
            svg.call(function(g){g.select('.domain').remove()});
            svg.call(function(g) {
                g.call(function(g){
                    g.selectAll('.tick line')
                        .attr('x1', '0%')
                        .attr('x2', `${width}`)
                });
            });
        }

        svg.append("g")
            .call(yAxis);
        
        svg.append("path")
            .datum(data)
            .attr("fill", "#662583")
            .attr("fill-opacity", .3)
            .attr("stroke", "none")
            .attr("d", d3.area()
                .x(function(d) { return x(d.Year) + x.bandwidth() / 2 })
                .y0(height)
                .y1(function(d) { return y(d.Incremento) })
            )
      
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#662583")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Year)  + x.bandwidth() / 2 })
                .y(function(d) { return y(d.Incremento) })
            )
    });
}