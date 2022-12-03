async function buildPlot() {
    const data = await d3.json("../umap.json");
    const dateParser = d3.timeParse("%%d-%m-Y");

    const yAccessor = (d) => d.y;
    const xAccessor = (d) => dateParser(d.date_publ);
    const clusterAccessor = (d) => d.cluster;
    const heightAccessor = (d) => d.x;


    var dimension = {
        width: window.innerWidth*0.9,
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

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const clusterAccessorG = clusterAccessor
    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,50]);
    te = groupedData
    //added scaler
    const tempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data,tempHighAccessor))
        .range([dimension.boundedHeight,50]);
    const heightAccessorG = heightAccessor

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);
    re = dateParserGR
    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => tempHighScaler(yAccessor(d)));


    var xAxis = d3.axisBottom()
        .scale(xScaler);

    var yAxis = d3.axisLeft()
        .scale(tempHighScaler);

    yAxis.tickFormat( (d,i) => d + "F")
}

function getRandomData(ordinal = false) {


    const MINTIME = d3.min(xAccessor)


    return [...Array(NGROUPS).keys()].map(i => ({
        group: 'group' + (i+1),
        data: getGroupData()
    }));


    function getGroupData() {

        return [...Array(Math.ceil(Math.random()*MAXLINES)).keys()].map(i => ({
            label: 'label' + (i+1),
            data: getSegmentsData()
        }));

        function getSegmentsData() {
            const nSegments = heightAccessor*MAXSEGMENTS

            let runLength = MINTIME;

            return [...Array(nSegments).keys()].map(i => {
                const tDivide = [Math.random(), Math.random()].sort(),
                    start = xAccessor.getTime() + tDivide[0]*segMaxLength,
                    end = xAccessor.runLength.getTime() + tDivide[1]*segMaxLength;

                runLength = new Date(runLength.getTime() + segMaxLength);

                return {
                    timeRange: [start, end]
                };
            });

        }
    }
}