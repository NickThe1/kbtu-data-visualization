async function buildPlot(id, name, it, real) {
    var data = await d3.json("/data/" + name + "/" + it);

    if(data == null){
        data = await d3.json("/data/googl/1")
        real="Incorrect, googl shown"
    }

    const yAccessor = (d) => d.low;
    const tempHighAccessor = (d) => d.up;
    const xAccessor = (d) => d.ind;
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.45,
        height: 600,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#" + id)
            .html("") // clear div before drawing

    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain([-5000,5000])
        .range([dimension.boundedHeight,50]);
    //added scaler
    const tempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
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
        .attr("stroke","blue");

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
        .text('Generated cone');

    bounded.append('text')
        .attr('x', dimension.width/2 + 10)
        .attr('y', dimension.height*0.9)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .style('fill', "red")
        .text(real);

/*    bounded.append('text')
        .attr('x', dimension.width/2 + 10)
        .attr('y', dimension.height*0.85)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .style('fill', "blue")
        .text('TemperatureMin');*/
}

const nam = "googl"

function button_handler(){
    const x = document.getElementById("usr").value;
    buildPlot("wrapper", x, "1", x);
    buildPlot("wrapper1", x, "10", "future " + x);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    for (let i = 0; i < 5; i++) {
        await sleep(10000);
    }
}

function generate(){
    const x = document.getElementById("usr").value;
    for (let i = 0; i <= 14; i++) {
        let xx = i;
        let name = x + i.toString()
        buildPlot("wrapper", x, ((xx + 1)*10).toString(), name);
        buildPlot("wrapper1", x, ((xx + 10)*10).toString(), "future " + name);
        demo()
    }
}

buildPlot("wrapper", "googl", "1", nam);
buildPlot("wrapper1", "googl", "20", "future " + nam);