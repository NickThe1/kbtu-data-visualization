async function buildPlot() {
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const tempHighAccessor = (d) => d.temperatureHigh;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,50]);

    const tempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data,tempHighAccessor))
        .range([dimension.boundedHeight,50]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var tempHighGenerator = d3.line()
        .x(d => tempHighScaler(tempHighAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var xAxis = d3.axisBottom()
        .scale(xScaler);

    var yAxis = d3.axisLeft()
        .scale(yScaler);

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("transform", "translate(80, 10)")
        .attr("fill","none")
        .attr("stroke","black");

    /*bounded.append("path")
        .attr("d",tempHighGenerator(data))
        .attr("transform", "translate(50, 10)")
        .attr("fill","none")
        .attr("stroke","red");*/

    const calibration = dimension.boundedHeight + 10

    bounded.append("g")
        .attr("transform", "translate(80, " + calibration +")")
        .call(xAxis);

    bounded.append("g")
        .attr("transform", "translate(80, 10)")
        .call(yAxis);

    bounded.append('text')
        .attr('x', dimension.width/2 + 10)
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
}

buildPlot();