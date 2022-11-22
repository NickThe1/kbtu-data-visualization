async function drawBar(btnId, data) {

    const dataset = await d3.json("./umap1.json")
    //Accessor
    const xAccessor = d => d.Comp1;
    const yAccessor = d => d["Comp2"];
    console.log(yAccessor((dataset)))
    // to shift x & y axes and data to right
    const shift = 50;

    const width = 800
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,
        },
    }
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    // 3. Draw canvas

    const wrapper = d3.select("#wrapper")
        .html("") // clear div before drawing
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset,xAccessor))
        .range([0,dimensions.boundedWidth])
        .nice()


    const yScaler = d3.scaleLinear()
        .domain(d3.extent(dataset,yAccessor))
        .range([dimensions.boundedHeight,0])

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .attr("transform", `translate(${shift},${dimensions.boundedHeight} )`);


    // y axis
    const yAxisGen = d3.axisLeft()
        .scale(yScaler);
    const yAxis = bounds.append("g")
        .call(yAxisGen)
        .attr("transform", `translate(${shift}, 0)`);

    const xLabel = bounds.append("text")
        .attr("x",dimensions.boundedWidth - 30)
        .attr("y",dimensions.boundedHeight + 30)
        .text("Temperature")
        .attr("fill","black")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const yLabel = bounds.append("text")
        .attr("x",20)
        .attr("y",30)
        .text("Count")
        .attr("fill","black")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const scatter = bounds.append('g')
        .selectAll("dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScaler(d["Comp1"]); } )
        .attr("cy", function (d) { return yScaler(d["Comp2"]) + shift; } )
        .attr("r", 4)
        .attr("transform", "translate(" + 100 + "," + -shift + ")")
        .style("fill", function (d) { return d["Label"] == 0 ? "red" : d["Label"] == 1 ? "blue" : "green"; });
}


drawBar(null, "temperatureLow");