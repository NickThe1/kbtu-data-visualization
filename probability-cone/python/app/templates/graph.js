async function buildPlot(id) {
    const data = await d3.json("/data");
    console.log(data)
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const tempHighAccessor = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.45,
        height: 500,
        margin: {
            top: 15,
            left: 0,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#" + id);
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,50]);

    //added scaler
    const tempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data,tempHighAccessor))
        .range([dimension.boundedHeight,50]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => tempHighScaler(yAccessor(d)));

    var tempHighGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => tempHighScaler(tempHighAccessor(d)));

    var xAxis = d3.axisBottom()
        .scale(xScaler);

    var yAxis = d3.axisLeft()
        .scale(tempHighScaler);

    yAxis.tickFormat( (d,i) => d + "F")

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("transform", "translate(80, -30)")
        .attr("fill","none")
        .attr("stroke","blue");

    bounded.append("path")
        .attr("d",tempHighGenerator(data))
        .attr("transform", "translate(80, -30)")
        .attr("opacity", 0.5)
        .attr("fill","none")
        .attr("stroke","red");

    const calibration = dimension.boundedHeight + 10

    bounded.append("g")
        .attr("transform", "translate(80, " + calibration +")")
        .call(xAxis);

    bounded.append("g")
        .attr("transform", "translate(80, 10)")
        .call(yAxis);

    bounded.append('text')
        .attr('x', dimension.width/3)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Temperature');

    bounded.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('transform', 'translate(50,' + dimension.height/1.8 + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .text('Temperature in Fahrenheit');

    bounded.append('text')
        .attr('x', dimension.width/2 + 10)
        .attr('y', dimension.height*0.9)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .style('fill', "red")
        .text('TemperatureHigh');

    bounded.append('text')
        .attr('x', dimension.width/2 + 10)
        .attr('y', dimension.height*0.85)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .style('fill', "blue")
        .text('TemperatureMin');
}

buildPlot("wrapper");

buildPlot("wrapper1");