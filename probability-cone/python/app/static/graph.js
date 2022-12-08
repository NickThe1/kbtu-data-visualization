async function clear(){
    const parent = d3.select("#wrapper")
    parent.selectAll('*').remove()

    var width = 700;
    var height = 500;
    var spacing = 100;
    var svg = parent.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+ spacing/2 + "," + spacing/2 + ")")

    var xScaler = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width-spacing-50]);
    var yScaler = d3.scaleLinear()
        .domain([0, 100])
        .range([height-spacing, 0])
    var xAxis = d3.axisBottom(xScaler)
    var yAxis = d3.axisLeft(yScaler)

    svg.append("g")
        .attr("transform", "translate(30, " + (height-spacing) + ")")
        .call(xAxis)
    svg.append("g")
        .attr("transform", "translate(30,0)")
        .call(yAxis)

    svg.append('text')
        .attr("x", height/2)
        .attr("y", height-60)
        .text("Date")
    svg.append('text')
        .attr("y", height/2.5)
        .attr("x", -35)
        .text("Open")
    svg.append('text')
        .attr("y", -20)
        .attr("x", width/3)
        .style("font-size", "20px")
        .text("Name")

    var svg2 = parent.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+ spacing/2 + "," + spacing/2 + ")")

    var xScaler = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width-spacing-50]);
    var yScaler = d3.scaleLinear()
        .domain([0, 100])
        .range([height-spacing, 0])
    var xAxis = d3.axisBottom(xScaler)
    var yAxis = d3.axisLeft(yScaler)

    svg2.append("g")
        .attr("transform", "translate(30, " + (height-spacing) + ")")
        .call(xAxis)
    svg2.append("g")
        .attr("transform", "translate(30,0)")
        .call(yAxis)

    svg2.append('text')
        .attr("x", height/2)
        .attr("y", height-60)
        .text("Date")
    svg2.append('text')
        .attr("y", height/2.5)
        .attr("x", -35)
        .text("Open")
    svg2.append('text')
        .attr("y", -20)
        .attr("x", width/3)
        .style("font-size", "20px")
        .text("Derivative")
}
clear()

