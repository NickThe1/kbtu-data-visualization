async function drawBar(btnId, data, clear) {

    if (clear){
        var dots = [[]]
        var dots1 = [[]]
    }
    else {
        var dots = generateRandomDots(20);
        var dots1 = generateRandomDots(20);
    }

    const dataset = await d3.json("./my_weather_data.json")
    //Accessor
    const xAccessor = d => d[data];
    const yAccessor = d => d.length;
    console.log(yAccessor(data))
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
        .domain([0, 100])
        .range([0,dimensions.boundedWidth])
        .nice()

    const yScaler = d3.scaleLinear()
        .domain([0, 100])
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
        .text("X")
        .attr("fill","black")
        .attr("font-size","15px")
        .attr("text-anchor","middle");

    const yLabel = bounds.append("text")
        .attr("x",20)
        .attr("y",30)
        .text("Y")
        .attr("fill","black")
        .attr("font-size","15px")
        .attr("text-anchor","middle");

    const blue = bounds.append("text")
        .attr("x",100)
        .attr("y",40)
        .text("Blue dots")
        .attr("fill","blue")
        .attr("font-size","15px")
        .attr("text-anchor","middle");

    const red = bounds.append("text")
        .attr("x",100)
        .attr("y",20)
        .text("Red dots")
        .attr("fill","red")
        .attr("font-size","15px")
        .attr("text-anchor","middle");


    const scatter = bounds.append('g')
        .selectAll("dot")
        .data(dots)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScaler(d[0]); } )
        .attr("cy", function (d) { return yScaler(d[1]) + shift; } )
        .attr("r", 4)
        .attr("transform", "translate(" + 100 + "," + -shift + ")")
        .style("fill", "red");

    const scatter1 = bounds.append('g')
        .selectAll("dot")
        .data(dots1)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScaler(d[0]); } )
        .attr("cy", function (d) { return yScaler(d[1]) + shift; } )
        .attr("r", 4)
        .attr("transform", "translate(" + 100 + "," + -shift + ")")
        .style("fill", "blue");

    //coloring buttons
    changeActiveButton(btnId);
}

function generateRandomDots(amount){
    var dots = []; // Initialize array
    for (var i = 0 ; i < amount; i++) {
        dots[i] = []; // Initialize inner array
        for (var j = 0; j < 2; j++) {
            if (i % 2 === 1){
                dots[i][j] = Math.random() * 90 ;
            }
            else {
                dots[i][j] = Math.random() * 90 ;
            }

        }
    }
    return dots;
}

function changeActiveButton(id){
    if(id == null){
        return 0;
    }
    //remove active class
    const activeButton = document.getElementsByClassName("active");
    activeButton[0].classList.remove("active");

    //add active class to clicked button
    const clickedButton = document.getElementById(id)
    clickedButton.classList.add("active");
}

drawBar(null, "temperatureLow");